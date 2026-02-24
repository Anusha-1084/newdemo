import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimesheetService } from 'src/app/core/services/timesheet/timesheet.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/authservice/auth.service';

type Status = 'Pending' | 'Approved' | 'Rejected';

interface TimesheetRow {
  id: number | string;
  employee: string;
  empId: string;
  dateRange: string;
  client: string;
  project: string;
  hours: number;
  type: string;
  status: Status;
  submitted: string;
}

interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

@Component({
  selector: 'app-approve-timesheet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approve-timesheet.component.html',
  styleUrls: ['./approve-timesheet.component.scss']
})
export class ApproveTimesheetComponent implements OnInit {
  private timesheetService: TimesheetService = inject(TimesheetService);
  private authService: AuthService = inject(AuthService);

  managerName = 'David Wilson';
  currentDate = new Date();
  currentTime = this.formatTime(new Date());

  stats = { pending: 0, approved: 0, rejected: 0, totalHours: 0 };
  activeTab: 'All' | 'Pending' | 'Approved' | 'Rejected' = 'Pending';

  allRows: TimesheetRow[] = [];
  displayed: TimesheetRow[] = [];
  filters = { search: '', employee: '', status: '' };

  ngOnInit() {
    this.loadTimesheetHistoryForAll();
  }

  /** Used by *ngFor to avoid re-renders */
  public trackById(index: number, row: TimesheetRow) {
    return row?.id ?? row?.empId ?? row?.dateRange ?? index;
  }

  // Manager: load all users' timesheet history via /timesheet/history/all
  loadTimesheetHistoryForAll() {
    const token = this.authService.getAccessToken?.() ?? undefined;
    this.timesheetService.getAllTimesheets(token).subscribe({
      next: (res: ApiResponse<any[]>) => {
        this.allRows = (res?.data || []).map((r: any) => this.mapToRow(r));
        this.displayed = [...this.allRows];
        this.updateStats();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load all timesheet history', err);
        alert(`Unable to load timesheet history (${err.status}). Check server logs.`);
      }
    });
  }

  // Optional per-user range loader (note: /timesheet returns a single period object, not a list)
  loadTimesheetRangeForCurrentUser(startDate?: string, endDate?: string) {
    const token = this.authService.getAccessToken?.() ?? undefined;
    const today = new Date();
    const sDate = startDate ?? new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const eDate = endDate ?? today.toISOString().split('T')[0];

    this.timesheetService.getTimesheetEntries(sDate, eDate, token).subscribe({
      next: (res: ApiResponse<any>) => {
        // Only map if backend returns a list; otherwise keep using history/all for the grid
        const list = Array.isArray(res?.data) ? res.data : [];
        this.allRows = list.map((r: any) => this.mapToRow(r));
        this.displayed = [...this.allRows];
        this.updateStats();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load timesheet entries', err);
        alert('Unable to load timesheet history. Please try again.');
      }
    });
  }

  private mapToRow(r: any): TimesheetRow {
    return {
      id: r.id ?? r.timesheetId ?? r.timesheet_id ?? '',
      employee: r.employeeName ?? r.username ?? 'Unknown',
      empId: r.userId ?? r.empId ?? '',
      dateRange: r.startDate && r.endDate ? `${r.startDate} - ${r.endDate}` : (r.dateRange ?? ''),
      client: r.client ?? r.clientName ?? 'Unknown',
      project: r.project ?? r.projectName ?? 'Unknown',
      hours: Number(r.totalHours ?? r.hours ?? 0),
      type: r.timesheetType ?? (r.type ?? 'WEEKLY'),
      status: this.mapStatus(r.status),
      submitted: r.startDate ?? (r.submitted ?? '')
    };
  }

  setTab(tab: 'All' | 'Pending' | 'Approved' | 'Rejected') {
    this.activeTab = tab;
    this.applyFilters();
  }

  applyFilters() {
    const s = this.filters.search?.toLowerCase().trim();
    this.displayed = this.allRows.filter(r => {
      const matchSearch =
        !s ||
        r.employee.toLowerCase().includes(s) ||
        r.client.toLowerCase().includes(s) ||
        r.project.toLowerCase().includes(s);

      const matchEmployee = !this.filters.employee || r.empId === this.filters.employee;
      const matchTabStatus = this.activeTab === 'All' || r.status === this.activeTab;
      const matchDropdownStatus = !this.filters.status || r.status === this.filters.status;

      return matchSearch && matchEmployee && matchTabStatus && matchDropdownStatus;
    });
  }

  clearFilters() {
    this.filters = { search: '', employee: '', status: '' };
    this.displayed = [...this.allRows];
  }

  /**
   * Approve timesheet -> POST /timesheet/{id}/approve
   */
  approve(row: TimesheetRow) {
    if (!row?.id || row.status !== 'Pending') {
      // Button is disabled in template; guard here as well
      return;
    }
    const token = this.authService.getAccessToken?.() ?? undefined;

    this.timesheetService.approveTimesheet(row.id, token).subscribe({
      next: () => {
        row.status = 'Approved';
        this.updateStats();
        alert(`Timesheet for ${row.employee} approved successfully`);
      },
      error: (err: HttpErrorResponse) => {
        if (err?.status === 409 && /approved/i.test(err?.error?.message || '')) {
          // Already approved – sync UI
          row.status = 'Approved';
          this.updateStats();
        }
        console.error('Approve failed', err);
        alert(err?.error?.message || `Failed to approve timesheet for ${row.employee}.`);
      }
    });
  }

  /**
   * Reject timesheet -> POST /timesheet/{id}/reject?reason=
   */
  reject(row: TimesheetRow) {
    if (!row?.id || row.status !== 'Pending') {
      return;
    }
    const token = this.authService.getAccessToken?.() ?? undefined;
    const reason = prompt('Enter rejection reason (optional):') ?? '';

    this.timesheetService.rejectTimesheet(row.id, reason, token).subscribe({
      next: () => {
        row.status = 'Rejected';
        this.updateStats();
        alert(`Timesheet for ${row.employee} rejected successfully`);
      },
      error: (err: HttpErrorResponse) => {
        if (err?.status === 409 && /rejected/i.test(err?.error?.message || '')) {
          // Already rejected – sync UI
          row.status = 'Rejected';
          this.updateStats();
        }
        console.error('Reject failed', err);
        alert(err?.error?.message || `Failed to reject timesheet for ${row.employee}.`);
      }
    });
  }

  updateStats() {
    const pending = this.allRows.filter(r => r.status === 'Pending').length;
    const approved = this.allRows.filter(r => r.status === 'Approved').length;
    const rejected = this.allRows.filter(r => r.status === 'Rejected').length;
    const totalHours = this.allRows.reduce((sum, r) => sum + (r.status === 'Approved' ? r.hours : 0), 0);
    this.stats = { pending, approved, rejected, totalHours };
  }

  statusClass(status: Status) {
    return status.toLowerCase();
  }

  private formatTime(d: Date) {
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  }

  private mapStatus(s: any): Status {
    if (!s) return 'Pending';
    const lower = String(s).toLowerCase();
    if (lower === 'approved') return 'Approved';
    if (lower === 'rejected') return 'Rejected';
    return 'Pending';
  }
}
