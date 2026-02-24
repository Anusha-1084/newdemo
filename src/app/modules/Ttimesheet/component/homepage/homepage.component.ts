import { CommonModule, NgClass, NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/authservice/auth.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/userservice/user.service';
import { TimesheetHomeComponent } from '../timesheet-home/timesheet-home.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [NgIf, NgClass, CommonModule,TimesheetHomeComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent implements OnInit {
  private baseUrl = environment.baseUrl;

  userData: any = null;
  isLoading: boolean = true;
  userId: any;
  status: string = 'OUT';
  checkInTime: string = '00:00:00';
  private timerInterval: any;
  private elapsedSeconds: number = 0;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getId();
    console.log(this.userId);

    this.loadUserProfile();
    this.loadStatus();
  }

  loadUserProfile() {
    this.userService.getUserProfile().subscribe(
      (data) => {
        if (data) {
          console.log(data);
          this.userData = data;
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading profile data', error);
        this.isLoading = false;
      }
    );
  }

  toggleStatus() {
    if (this.status === 'OUT') {
      this.status = 'IN';
      this.checkIn();
      this.startTimer(this.updateDisplayedTime);
    } else {
      this.status = 'OUT';
      this.checkOut();
      this.stopTimer();
    }
  }

  startTimer(callback: (formattedTime: string) => void) {
    if (this.timerInterval) return;

    this.timerInterval = setInterval(() => {
      this.elapsedSeconds++;
      const formatted = this.formatTime(this.elapsedSeconds);
      callback(formatted);
    }, 1000);
  }

  private updateDisplayedTime = (formattedTime: string) => {
    this.checkInTime = formattedTime;
  };

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  checkIn() {
    const url = `${this.baseUrl}/checkout/checkin`;
    const token = this.authService.getAccessToken();

    if (!token) {
      console.error('Token not available. User not authenticated.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.post<any>(url, {}, { headers }).subscribe(
      (response) => {
        console.log('Checked in successfully');
        this.status = 'IN';
        if (response.totalHours) {
          const [hh, mm, ss] = response.totalHours.split(':').map(Number);
          this.elapsedSeconds = hh * 3600 + mm * 60 + ss;
        }
        this.checkInTime = this.formatTime(this.elapsedSeconds);
        this.startTimer(this.updateDisplayedTime);
      },
      (error) => {
        console.error('Error checking in', error);
      }
    );
  }

  checkOut() {
    const url = `${this.baseUrl}/checkout?totalHours=${this.checkInTime}`;
    const token = this.authService.getAccessToken();

    if (!token) {
      console.error('Token not available. User not authenticated.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.post<any>(url, null, { headers }).subscribe(
      (response) => {
        console.log('Checked out successfully');
        this.status = 'OUT';
        this.stopTimer();
      },
      (error) => {
        console.error('Error checking out', error);
      }
    );
  }

  loadStatus() {
    const url = `${this.baseUrl}/checkout/status`;
    const token = this.authService.getAccessToken();

    if (!token) {
      console.error('Token not available. User not authenticated.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<any>(url, { headers }).subscribe(
      (response) => {
        console.log(response);
        this.status = response.status;

        this.stopTimer();

        if (response.status === 'IN' && response.last_check_in) {
          const lastCheckIn = new Date(response.last_check_in).getTime();
          const now = Date.now();
          this.elapsedSeconds = Math.floor((now - lastCheckIn) / 1000);
          this.checkInTime = this.formatTime(this.elapsedSeconds);

          localStorage.setItem('last_check_in', response.last_check_in);

          this.startTimer(this.updateDisplayedTime);
        } else {
          if (response.total_hours_today) {
            const [hh, mm, ss] = response.total_hours_today
              .split(':')
              .map(Number);
            this.elapsedSeconds = hh * 3600 + mm * 60 + ss;
            this.checkInTime = this.formatTime(this.elapsedSeconds);
          }

          localStorage.removeItem('last_check_in');
        }
      },
      (error) => {
        console.error('Error loading status', error);
        const storedCheckIn = localStorage.getItem('last_check_in');
        if (storedCheckIn) {
          const lastCheckIn = new Date(storedCheckIn).getTime();
          const now = Date.now();
          this.elapsedSeconds = Math.floor((now - lastCheckIn) / 1000);
          this.checkInTime = this.formatTime(this.elapsedSeconds);
          this.startTimer(this.updateDisplayedTime);
        }
      }
    );
  }
}
