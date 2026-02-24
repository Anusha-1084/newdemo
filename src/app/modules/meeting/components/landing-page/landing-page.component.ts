import { Component, OnInit, OnDestroy } from '@angular/core';
import { MeetingService } from 'src/app/core/services/meeting.service';
import { MeetingDto, MeetingType, MeetingStatus } from 'src/app/models/MeetingDto.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ScheduleMeetingComponent } from '../schedule-meeting/schedule-meeting.component';
import { JoinMeetingComponent } from '../join-meeting/join-meeting.component';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, DatePipe, MatIconModule, MatDialogModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  currentTime: string = '';
  currentDate: string = '';
  upcomingMeetings: MeetingDto[] = [];
  private timeSubscription!: Subscription;
  private meetingRefreshSubscription!: Subscription;

  constructor(
    private meetingService: MeetingService,
    private dialog: MatDialog,
    private userDataService: UserDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateDateTime();
    this.timeSubscription = interval(1000).subscribe(() => this.updateDateTime());
    
    const user = this.userDataService.getCurrentUserData();
    const userId = user?.id;

    if (!userId) {
      console.error('⚠️ User not logged in or ID not found');
      return;
    }

    this.loadUpcomingMeetings();
    // Auto-refresh meetings every minute
    this.meetingRefreshSubscription = interval(60000).subscribe(() => this.loadUpcomingMeetings());
  }

  private loadUpcomingMeetings(): void {
    this.meetingService.getUpcomingMeetings().subscribe({
      next: (res) => {
        this.upcomingMeetings = res
          .map((meeting) => ({
            ...meeting,
            startTime: this.parseDateSafely(meeting.startTime),
          }))
          .filter((meeting) => {
            const start = meeting.startTime;
            return start instanceof Date && start > new Date();
          })
          .sort((a, b) => (a.startTime?.getTime() ?? 0) - (b.startTime?.getTime() ?? 0));
      },
      error: (err) => console.error('Error loading meetings:', err),
    });
  }

  private parseDateSafely(value: string | Date | undefined): Date | undefined {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    const fixed = value.includes(' ') ? value.replace(' ', 'T') : value;
    const parsedDate = new Date(fixed);
    return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
  }

  private updateDateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.currentDate = now.toDateString();
  }

  // ✅ Create Instant Meeting with Meeting Code Display
  onCreateMeeting() {
    const user = this.userDataService.getCurrentUserData();
    const userId = user?.id;

    if (!userId) {
      console.error('User not logged in');
      return;
    }

    const instantMeeting: MeetingDto = {
      title: 'Instant Meeting',
      type: MeetingType.INSTANT,
      lobbyEnabled: false,
    };

    this.meetingService.createMeeting(instantMeeting).subscribe({
      next: (meeting) => {
        // Show Meeting Code after creation
        alert(`✅ Meeting Created!\nMeeting ID: ${meeting.meetingId}\nMeeting Code: ${meeting.meetingCode}`);
        // Optional copy
        if (meeting.meetingCode) {
          navigator.clipboard.writeText(meeting.meetingCode);
        }
        // Navigate to meeting
        this.router.navigate(['/layout/meet', meeting.meetingId]);
      },
      error: (err) => {
        console.error('Create meeting error:', err);
        alert('Failed to create meeting');
      },
    });
  }

  onJoinMeeting() {
    this.dialog.open(JoinMeetingComponent, {
      width: '450px',
      disableClose: true,
    });
  }

  onScheduleMeeting() {
     this.dialog.open(ScheduleMeetingComponent, {
    width: '520px',
    height: 'auto',
    maxHeight: '90vh',
    disableClose: true,
    autoFocus: true,
    panelClass: 'compact-dialog'
  });
  }

  onShareScreen() {
    console.log('Share screen');
  }

  // ✅ Copy Meeting Code helper
  copyCode(code?: string) {
    if (code) {
      navigator.clipboard.writeText(code);
      alert('Meeting code copied!');
    }
  }

  // Join upcoming meeting
  joinUpcomingMeeting(meeting: MeetingDto) {
    if (meeting.meetingId) {
      this.router.navigate(['/layout/meet', meeting.meetingId]);
    }
  }

  // Check if meeting should be highlighted (within 5 minutes of start time)
  shouldHighlight(meeting: MeetingDto): boolean {
    if (!meeting.startTime) return false;
    const now = new Date();
    const startTime = meeting.startTime instanceof Date ? meeting.startTime : new Date(meeting.startTime);
    const timeDiff = startTime.getTime() - now.getTime();
    return timeDiff <= 5 * 60 * 1000 && timeDiff > 0; // Within 5 minutes
  }

  // Get meeting status display
  getMeetingStatus(meeting: MeetingDto): string {
    if (meeting.status === MeetingStatus.ACTIVE) return 'ACTIVE';
    if (meeting.status === MeetingStatus.ENDED) return 'ENDED';
    return 'SCHEDULED';
  }

  ngOnDestroy(): void {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
    if (this.meetingRefreshSubscription) {
      this.meetingRefreshSubscription.unsubscribe();
    }
  }
}
