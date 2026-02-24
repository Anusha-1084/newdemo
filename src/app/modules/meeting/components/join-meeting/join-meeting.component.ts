import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MeetingService } from 'src/app/core/services/meeting.service';
import { UserDataService } from 'src/app/core/services/user-data.service';

@Component({
  selector: 'app-join-meeting',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './join-meeting.component.html',
  styleUrls: ['./join-meeting.component.css']
})
export class JoinMeetingComponent {
  joinForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private userDataService: UserDataService,
    private router: Router,
    public dialogRef: MatDialogRef<JoinMeetingComponent>
  ) {
    this.joinForm = this.fb.group({
      meetingId: ['', Validators.required],
      password: ['']
    });
  }

  onJoin() {
    if (this.joinForm.valid) {
      const { meetingId, password } = this.joinForm.value;
      const user = this.userDataService.getCurrentUserData();
      const userId = user?.id;

      if (!userId) {
        alert('User not logged in');
        return;
      }

      this.meetingService.joinMeeting(meetingId, password).subscribe({
        next: (meeting) => {
          this.dialogRef.close();
          this.router.navigate(['/layout/meet', meetingId]);
        },
        error: (err) => {
          console.error('Join meeting error:', err);
          alert('Failed to join meeting. Please check the meeting ID and password.');
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}