import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LeaveService } from 'src/app/core/services/leave/leave.service';
import { LeaveBalanceService } from 'src/app/core/services/leave/leave-balance.service';
import { HolidayService } from 'src/app/core/services/leave/holiday.service';
import { AuthService } from 'src/app/core/services/authservice/auth.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {

  employeeId = 0;
  userId = 0;
  isManager = false;

  // ================= SUMMARY COUNTS =================
  totalLeaves = 0;
  pendingLeaves = 0;
  approvedLeaves = 0;
  rejectedLeaves = 0;

  upcomingLeaves: any[] = [];
  upcomingCount = 0;

  recentLeaves: any[] = [];
  totalDaysTaken = 0;

  teamPendingCount = 0;
  holidays: any[] = [];

  // ================= LEAVE BALANCE =================
  leaveBalances: any[] = [];
  leaveBalanceLoading = true;
  leaveBalanceError = false;

  showLeaveBalanceModal = false;
  selectedLeaveBalance: any = null;

  // ================= CACHE =================
  private myLeaves: any[] = [];

  constructor(
    private leaveService: LeaveService,
    private leaveBalanceService: LeaveBalanceService,
    private holidayService: HolidayService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    if (!storedUserId) {
      console.error('UserId is missing');
      this.leaveBalanceError = true;
      return;
    }

    this.userId = Number(storedUserId);
    this.employeeId = this.userId;
    this.isManager = role === 'ROLE_MGR' || role === 'ROLE_ADMIN';

    this.loadMyLeaves();
    this.loadLeaveBalances();
    this.loadTeamPendingApprovals();
    this.loadHolidays();
  }

  // ================= LEAVES =================
  loadMyLeaves() {
    this.leaveService.getMyLeaves().subscribe({
      next: (res: any[]) => {
        this.myLeaves = res.map(l => ({
          ...l,
          leaveType: l.leave_type,
          startDate: new Date(l.start_date),
          endDate: new Date(l.end_date),
          status: l.status
        }));

        this.calculateCounts();
        this.calculateUpcomingLeaves();
        this.calculateRecentLeaves();
        this.calculateTotalDaysTaken();
      },
      error: () => console.error('Failed loading my leaves')
    });
  }

  calculateCounts() {
    this.totalLeaves = this.myLeaves.length;
    this.pendingLeaves = this.myLeaves.filter(l => l.status === 'PENDING').length;
    this.approvedLeaves = this.myLeaves.filter(l => l.status === 'APPROVED').length;
    this.rejectedLeaves = this.myLeaves.filter(l => l.status === 'REJECTED').length;
  }

  calculateUpcomingLeaves() {
    const today = new Date();
    this.upcomingLeaves = this.myLeaves.filter(
      l => l.status === 'APPROVED' && l.startDate > today
    );
    this.upcomingCount = this.upcomingLeaves.length;
  }

  calculateRecentLeaves() {
    this.recentLeaves = [...this.myLeaves]
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
      .slice(0, 5);
  }

  calculateTotalDaysTaken() {
    const today = new Date();
    this.totalDaysTaken = this.myLeaves
      .filter(l => l.status === 'APPROVED' && l.endDate <= today)
      .reduce((sum, l) => {
        const days =
          Math.floor((l.endDate.getTime() - l.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return sum + days;
      }, 0);
  }

  // ================= LEAVE BALANCE =================
  loadLeaveBalances() {
    this.leaveBalanceLoading = true;
    this.leaveBalanceError = false;

    this.leaveBalanceService.getBalance(this.userId).subscribe({
      next: (res: any) => {
        this.leaveBalances = res?.balances || [];
        this.leaveBalanceLoading = false;
      },
      error: () => {
        this.leaveBalanceError = true;
        this.leaveBalanceLoading = false;
      }
    });
  }

  openLeaveBalanceModal(lb: any) {
    this.selectedLeaveBalance = lb;
    this.showLeaveBalanceModal = true;
  }

  closeLeaveBalanceModal() {
    this.showLeaveBalanceModal = false;
    this.selectedLeaveBalance = null;
  }

  getUsagePercent(lb: any): number {
    if (!lb?.total) return 0;
    return Math.round((lb.used / lb.total) * 100);
  }

  getBalanceColor(lb: any): string {
    if (lb.remaining === 0) return 'danger';
    if (lb.remaining <= 2) return 'warning';
    return 'success';
  }

  // ================= MANAGER + HOLIDAYS =================
  loadTeamPendingApprovals() {
    if (!this.isManager) return;

    this.leaveService.getTeamLeaves('PENDING').subscribe({
      next: res => (this.teamPendingCount = res.length),
      error: () => console.error('Error loading team approvals')
    });
  }

  loadHolidays() {
    this.holidayService.getAllHolidays().subscribe({
      next: res => (this.holidays = res),
      error: () => console.error('Error loading holidays')
    });
  }
}
