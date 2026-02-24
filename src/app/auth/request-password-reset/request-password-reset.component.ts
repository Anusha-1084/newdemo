import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from 'src/app/core/services/userservice/user.service';

@Component({
  selector: 'app-request-password-reset',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.scss'],
  providers: [UserService],
})
export class RequestPasswordResetComponent {
  requestPasswordResetForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.requestPasswordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.requestPasswordResetForm.valid) {
      this.isLoading = true;
      const email = this.requestPasswordResetForm.value.email;

      this.userService.requestPasswordReset(email).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Password reset link sent to your email.', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage =
            error?.error?.message || 'Error sending password reset link. Please try again.';
          this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
        },
      });
    }
  }
}
