import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from 'src/app/core/services/userservice/user.service';

@Component({
  selector: 'app-forgot-password-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    HttpClientModule,
    MatSnackBarModule
  ],
  templateUrl: './forgot-password-popup.component.html',
  styleUrls: ['./forgot-password-popup.component.scss'],
  providers: [UserService]
})
export class ForgotPasswordPopupComponent {
  @Output() close = new EventEmitter<void>();
  email: string = '';
  mobile: string = '';
  selectedOption: string = 'email';

  constructor(
    @Inject(UserService) private userService: UserService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ForgotPasswordPopupComponent>
  ) {}

  onSubmit() {
    if (this.selectedOption === 'email') {
      console.log('Email:', this.email);
      this.userService.requestPasswordReset(this.email).subscribe({
        next: (response) => {
          console.log('Password reset link sent!', response);
          this.snackBar.open('Password reset link sent!', 'Close', {
            duration: 3000,
          });
          this.closePopup();
        },
        error: (error: any) => {
          console.error('Error sending reset link', error);
          this.snackBar.open('Error sending reset link. Please try again.', 'Close', {
            duration: 3000,
          });
        }
      });
    }
  }

  closePopup() {
    this.dialogRef.close();
  }
}