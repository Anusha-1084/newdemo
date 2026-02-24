import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveService } from 'src/app/core/services/leave/leave.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class ApplyLeaveComponent implements OnInit {
  leaveForm!: FormGroup;
  attachmentFile: File | null = null;

  // ⭐ Only added for edit functionality
  isEdit: boolean = false;
  editId!: number;

  leaveTypes: string[] = [
    'SICK',
    'CASUAL',
    'EARNED',
    'UNPAID',
    'MATERNITY',
    'PATERNITY'
  ];

  leaveDurationTypes: string[] = ['HALF_TIME', 'FULL_TIME'];

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Your existing form (unchanged)
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      leaveDuration: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required],
      attachment: [null]
    });

    // ⭐ Detect Edit Mode
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.editId = params['id'];
        this.loadLeaveData(this.editId);
      }
    });
  }

  // ⭐ Load leave details for editing
  loadLeaveData(id: number) {
    this.leaveService.getLeaveById(id).subscribe({
      next: (leave) => {
        this.leaveForm.patchValue({
          leaveType: leave.leaveType,
          startDate: leave.startDate,
          endDate: leave.endDate,
          reason: leave.reason,
          leaveDuration: leave.isHalfDay ? 'HALF_TIME' : 'FULL_TIME'
        });
      },
      error: (err) => console.error("Error loading leave:", err)
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.attachmentFile = event.target.files[0];
      this.leaveForm.patchValue({ attachment: this.attachmentFile });
    }
  }

  // ⭐ Main submit button (unchanged — only extended)
  submitLeave() {
    // ⭐ If edit mode → call update
    if (this.isEdit) {
      this.updateLeave();
      return;
    }

    // ⭐ Else → normal apply leave
    this.createLeave();
  }

  // ⭐ Create leave (same as before)
  createLeave() {
    const payload = {
      leaveType: this.leaveForm.value.leaveType,
      startDate: this.leaveForm.value.startDate,
      isHalfDay: this.leaveForm.value.leaveDuration === 'HALF_TIME',
      endDate: this.leaveForm.value.endDate,
      reason: this.leaveForm.value.reason
    };

    this.leaveService.applyLeave(payload).subscribe({
      next: () => {
        alert('Leave applied successfully!');
        this.leaveForm.reset();
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Failed to submit leave');
      }
    });
  }

  // ⭐ Update leave (ONLY new code added)
  updateLeave() {
    const payload = {
      leaveType: this.leaveForm.value.leaveType,
      startDate: this.leaveForm.value.startDate,
      isHalfDay: this.leaveForm.value.leaveDuration === 'HALF_TIME',
      endDate: this.leaveForm.value.endDate,
      reason: this.leaveForm.value.reason
    };

    this.leaveService.updateLeave(this.editId, payload).subscribe({
      next: () => {
        alert('Leave updated successfully!');
        this.router.navigate(['/layout/leave-management/my-requests']);
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Failed to update leave');
      }
    });
  }

  cancelLeave() {
    this.leaveForm.reset();
    this.attachmentFile = null;
  }
}
