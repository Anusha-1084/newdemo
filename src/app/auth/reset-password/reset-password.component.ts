import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from 'src/app/core/services/userservice/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Initialize the form
    this.resetPasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Retrieve the token from the query parameter
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.snackBar.open('Invalid or missing token.', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
    }
  }

  // Validator to ensure the new password and confirm password match
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Handle form submission
  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.token) {
      const { newPassword } = this.resetPasswordForm.value;

      this.userService.resetPassword(this.token, newPassword).subscribe({
        next: () => {
          this.snackBar.open('Password has been reset successfully.', 'Close', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error resetting password:', error);
          this.snackBar.open('Failed to reset password. Please try again.', 'Close', { duration: 3000 });
        },
      });
    } else if (!this.token) {
      this.snackBar.open('Invalid token. Password reset failed.', 'Close', { duration: 3000 });
    }
  }
}
