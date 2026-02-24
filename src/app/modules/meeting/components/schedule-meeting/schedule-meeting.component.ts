import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MeetingService } from 'src/app/core/services/meeting.service';
import { MeetingDto, MeetingType } from 'src/app/models/MeetingDto.model';
import { UserDataService } from 'src/app/core/services/user-data.service';

@Component({
  selector: 'app-schedule-meeting',
  standalone: true,
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
})
export class ScheduleMeetingComponent implements OnInit {
  meetingForm!: FormGroup;
  minDateTime: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private userDataService: UserDataService,
    public dialogRef: MatDialogRef<ScheduleMeetingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const user = this.userDataService.getCurrentUserData();

    // Set minDateTime to 30 mins from now
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    this.minDateTime = now;

    this.meetingForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      password: [''],
      lobbyEnabled: [true],
      recordingEnabled: [false],
      maxParticipants: [100, [Validators.required, Validators.min(1), Validators.max(500)]],
      participantIds: [[]],
      hostId: [user?.id],
      type: [MeetingType.SCHEDULED],
    });
  }

  onSubmit(): void {
    if (this.meetingForm.valid) {
      const formValue = this.meetingForm.value;
      const now = new Date();
      const startTime = new Date(formValue.startTime);
      const endTime = new Date(formValue.endTime);

      // Validation logic
      const minStart = new Date(Date.now() + 30 * 60 * 1000);
      if (startTime < minStart) {
        alert('Start time must be at least 30 minutes after current time.');
        return;
      }

      if (endTime <= startTime) {
        alert('End time must be after start time.');
        return;
      }

      const meeting: MeetingDto = {
        ...formValue,
        startTime,
        endTime,
        type: MeetingType.SCHEDULED,
      };

      this.meetingService.createMeeting(meeting).subscribe({
        next: (createdMeeting) => {
          alert(`✅ Meeting Scheduled Successfully!\nMeeting ID: ${createdMeeting.meetingId}\nCode: ${createdMeeting.meetingCode}`);
          this.dialogRef.close(createdMeeting);
        },
        error: (err) => {
          console.error('Scheduling error:', err);
          alert('❌ Error scheduling meeting.');
        },
      });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}