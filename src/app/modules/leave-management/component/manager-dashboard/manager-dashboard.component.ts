import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { LeaveTypeService } from 'src/app/core/services/leave/leave-type.service';
import { LeaveService } from 'src/app/core/services/leave/leave.service';
import { UserService } from 'src/app/core/services/userservice/user.service';
import { AuthService } from 'src/app/core/services/authservice/auth.service';

interface LeaveType {
  id: number;
  name: string;
  code?: string;
  description?: string;
  defaultDays?: number;
  color?: string;
}

interface TeamLeave {
  id: number | string;
  userId?: number | null;
  employeeName: string;
  leaveType: string;
  startDate?: string;
  endDate?: string;
  totalDays: number;
  status: string;
  raw?: any;
}

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {
  private leaveTypeService = inject(LeaveTypeService);
  private leaveService = inject(LeaveService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  // UI state
  leaveTypes: LeaveType[] = [];
  selectedLeaveType: LeaveType | null = null;
  modalOpen = false;
  modalDays: number | null = null;
  saving = false;
  errorMessage = '';

  // users map
  private userMap = new Map<number, string>();
  loadingUsers = false;
  loadingUsersError = '';

  // team leaves
  teamLeaves: TeamLeave[] = [];
  loadingTeamLeaves = false;
  loadingLeavesError = '';

  MAX_DAYS_FOR_PROGRESS = 30;

  // fallback color palette
  private palette = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#e67e22', '#e74c3c', '#34495e'];

  ngOnInit() {
    this.loadAllUsers();       // build user map first
    this.loadLeaveTypes();
    this.loadTeamLeaves();
  }

  // ------------------ Users ------------------
  private loadAllUsers() {
    this.loadingUsers = true;
    this.loadingUsersError = '';
    this.userService.getAllUsers().subscribe({
      next: (users: any[]) => {
        try {
          users.forEach(u => {
            const id = Number(u.id ?? u.userId);
            const name = (u.firstName || u.username || u.email) ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.username || u.email : null;
            if (id && name) this.userMap.set(id, name);
          });
        } catch (e) {
          console.warn('user map build failed', e);
        }
        this.loadingUsers = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load users', err);
        this.loadingUsersError = 'Failed to load users';
        this.loadingUsers = false;
      }
    });
  }

  // optional: fetch one user by id (fallback)
  private async fetchUserNameFallback(userId: number): Promise<string | null> {
    try {
      const u: any = await this.userService.getUserById(userId).toPromise();
      const name = (u?.firstName ? `${u.firstName} ${u.lastName ?? ''}`.trim() : (u?.username ?? u?.email));
      if (name) this.userMap.set(userId, name);
      return name ?? null;
    } catch (e) {
      return null;
    }
  }

  // ------------------ Leave Types ------------------
  loadLeaveTypes() {
    const token = this.authService.getAccessToken?.() ?? undefined;
    this.leaveTypeService.getAll(token).subscribe({
      next: (res: any) => {
        const list = res?.data ?? res ?? [];
        this.leaveTypes = (list || []).map((l: any, idx: number) => ({
          id: Number(l.id ?? l.leaveTypeId ?? idx),
          name: l.name ?? l.type ?? `Type ${idx}`,
          code: l.code,
          description: l.description,
          defaultDays: Number(l.defaultDays ?? l.default_days ?? l.days ?? 0),
          color: l.color ?? this.palette[idx % this.palette.length]
        }));
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load leave types', err);
      }
    });
  }

  onLeaveTypeSelected(leaveTypeId: string | number) {
    const id = Number(leaveTypeId);
    if (!id) return;
    const sel = this.leaveTypes.find(t => t.id === id);
    if (sel) this.openSetDefaultModal(sel);
  }

  openSetDefaultModal(leave: LeaveType) {
    this.selectedLeaveType = leave;
    this.modalDays = leave.defaultDays ?? 0;
    this.modalOpen = true;
    this.errorMessage = '';
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedLeaveType = null;
    this.modalDays = null;
    this.errorMessage = '';
    document.body.style.overflow = '';
  }

  saveDefaultDays() {
    if (!this.selectedLeaveType) return;
    if (this.modalDays == null || isNaN(this.modalDays) || this.modalDays < 0) {
      this.errorMessage = 'Please enter a valid number of days';
      return;
    }
    this.saving = true;
    const token = this.authService.getAccessToken?.() ?? undefined;
    const payload: any = { name: this.selectedLeaveType.name, defaultDays: this.modalDays };

    this.leaveTypeService.update(this.selectedLeaveType.id, payload, token).subscribe({
      next: (res: any) => {
        // update local model
        this.leaveTypes = this.leaveTypes.map(lt =>
          lt.id === this.selectedLeaveType!.id ? { ...lt, defaultDays: this.modalDays! } : lt
        );
        this.saving = false;
        this.closeModal();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to save default days', err);
        this.errorMessage = err?.error?.message ?? 'Failed to save. Check permissions.';
        this.saving = false;
      }
    });
  }

  progressPercent(leave: LeaveType) {
    const days = Number(leave.defaultDays ?? 0);
    return Math.min(100, Math.max(0, Math.round((days / this.MAX_DAYS_FOR_PROGRESS) * 100)));
  }

  // ------------------ Team Leaves ------------------
 async loadTeamLeaves(status?: string) {
  this.loadingTeamLeaves = true;
  this.loadingLeavesError = '';

  const token = this.authService.getAccessToken?.() ?? undefined;

  this.leaveService.getTeamLeaves(status ?? '', token).subscribe({
    next: async (res: any) => {
      const list = res?.data ?? res ?? [];

      const mapped: TeamLeave[] = (list || []).map((r: any) => {
        const start = r.startDate;
        const end = r.endDate;

        return {
          id: r.id,
          userId: r.userId,
          employeeName: "Unknown",   // will fill later
          leaveType: r.leaveType,
          startDate: r.startDate,
          endDate: r.endDate,
          totalDays: this.computeDaysBetween(start, end),
          status: r.status
        };
      });

      // 🟢 FIX: attach employee name here from userMap
      for (let leave of mapped) {
        if (leave.userId && this.userMap.has(leave.userId)) {
          leave.employeeName = this.userMap.get(leave.userId)!;
        } else {
          leave.employeeName = "Unknown";
        }
      }

      this.teamLeaves = mapped;
      this.loadingTeamLeaves = false;
    },
    error: (err) => {
      console.error('Failed to load team leaves', err);
      this.loadingTeamLeaves = false;
      this.loadingLeavesError = 'Unable to load team leaves.';
    }
  });
}


  private computeDaysBetween(startIso?: string | null, endIso?: string | null): number {
    if (!startIso || !endIso) return 0;
    try {
      const s = new Date(startIso);
      const e = new Date(endIso);
      const diff = Math.floor((+e - +s) / (1000 * 60 * 60 * 24));
      return diff >= 0 ? diff + 1 : 0;
    } catch {
      return 0;
    }
  }

  approveRequest(row: TeamLeave) {
    if (!row?.id) return;
    const token = this.authService.getAccessToken?.() ?? undefined;
    const comment = prompt(`Approval comment (optional) for ${row.employeeName}:`) ?? '';
    this.leaveService.approveLeave(Number(row.id), comment, token).subscribe({
      next: () => {
        row.status = 'APPROVED';
      },
      error: (err: HttpErrorResponse) => {
        console.error('Approve failed', err);
        alert(err?.error?.message ?? 'Failed to approve leave');
      }
    });
  }

  rejectRequest(row: TeamLeave) {
    if (!row?.id) return;
    const token = this.authService.getAccessToken?.() ?? undefined;
    const comment = prompt(`Rejection reason for ${row.employeeName}:`) ?? '';
    this.leaveService.rejectLeave(Number(row.id), comment, token).subscribe({
      next: () => {
        row.status = 'REJECTED';
      },
      error: (err: HttpErrorResponse) => {
        console.error('Reject failed', err);
        alert(err?.error?.message ?? 'Failed to reject leave');
      }
    });
  }

  trackById(index: number, item: any) {
    return item?.id ?? index;
  }
}
