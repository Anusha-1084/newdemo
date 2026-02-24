import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/authservice/auth.service'; // <-- same service as TimeLogComponent

interface Timesheet {
  startDate: string;
  endDate: string;
  totalHours: number;
  timesheetType: string;
  status: string;
}

interface TimesheetResponse {
  code: number;
  success: boolean;
  message: string;
  data: Timesheet[];
}

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  timesheets: Timesheet[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit() {
    this.loadTimesheets();
  }

  loadTimesheets() {
    this.loading = true;

    const token = this.authService.getAccessToken() as string | null;
    if (!token) {
      this.loading = false;
      this.errorMessage = 'You are not authenticated. Please sign in.';
      return;
    }

    this.http.get<TimesheetResponse>('http://localhost:8888/timesheet/history', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .subscribe({
      next: (res) => {
        this.loading = false;
        if (res?.success && res?.data) {
          this.timesheets = res.data;
        } else {
          this.errorMessage = res?.message || 'Failed to fetch timesheets';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching timesheets:', err);
        this.errorMessage =
          err?.status === 401
            ? 'Unauthorized. Please sign in again.'
            : 'Unable to fetch timesheets. Please try again later.';
      }
    });
  }
}
