// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { environment } from 'src/environments/environment';
// import { CommonModule, Location } from '@angular/common';
// import { passwordMatchValidator } from './password-match.validator';
// import { TokenService } from 'src/app/core/services/tokenservice/token.service';
// import { LoginComponent } from '../login/login.component';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     MatIconModule,
//     CommonModule,
//   ],
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.scss']
// })
// export class RegisterComponent {
//   registerForm: FormGroup;
//   hidePassword: boolean = true;
//   hideConfirmPassword: boolean = true;
//   selectedTab: 'signup' | 'signin' = 'signup';
//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private http: HttpClient,
//     private location: Location,
//     private tokenService: TokenService
//   ) {
//     this.registerForm = this.fb.group(
//       {
//         firstName: ['', [Validators.required]],
//         lastName: ['', [Validators.required]],
//         username: ['', [Validators.required, Validators.minLength(3)]],
//         email: ['', [Validators.required, Validators.email]],
//         mobile_no: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
//         password: [
//           '',
//           [
//             Validators.required,
//             Validators.minLength(6),
//             Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$'),
//           ],
//         ],
//         confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
//       },
//       { validators: passwordMatchValidator }
//     );
//   }
//    selectTab(tab: 'signup' | 'signin') {
//     this.selectedTab = tab;
//   }

//   /**
//    * On form submission, registers the user and stores the JWT token.
//    */
//   onRegister() {
//     if (this.registerForm.valid && !this.registerForm.hasError('passwordMismatch')) {
//       const userData = this.registerForm.value;
//       const rememberMe = this.registerForm.get('rememberMe')?.value ?? false;

//       this.http.post(`${environment.apiUrl}/register`, userData).subscribe(
//         (response: any) => {
//           alert('User registered successfully');
//           console.log('User registered successfully', response);

//           this.tokenService.storeTokens(response.accessToken, response.refreshToken);

//           this.router.navigate(['/dashboard']);
//         },
//         (error) => {
//           alert('Registration failed. Please try again.');
//           console.error('Error registering user', error);
//         }
//       );
//     } else {
//       this.registerForm.markAllAsTouched();
//     }
//   }

//   togglePasswordVisibility() {
//     this.hidePassword = !this.hidePassword;
//   }

//   toggleConfirmPasswordVisibility() {
//     this.hideConfirmPassword = !this.hideConfirmPassword;
//   }

//   passwordLengthError() {
//     return (
//       this.registerForm.get('password')?.hasError('minlength') &&
//       this.registerForm.get('password')?.touched
//     );
//   }

//   passwordAlphanumericError() {
//     return (
//       this.registerForm.get('password')?.hasError('pattern') &&
//       this.registerForm.get('password')?.touched
//     );
//   }

//   mismatchError() {
//     return (
//       this.registerForm.get('confirmPassword')?.touched &&
//       this.registerForm.hasError('passwordMismatch')
//     );
//   }

//   navigateToLogin() {
//     this.router.navigate(['/login']);
//   }

//   navigateBack() {
//     this.location.back();
//   }
// }

import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environment'; // Ensure environment is correctly configured
import { CommonModule, Location } from '@angular/common';
import { passwordMatchValidator } from './password-match.validator'; // Your custom validator
import { TokenService } from 'src/app/core/services/tokenservice/token.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'; // Import MatDialogRef
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { NgZone } from '@angular/core'; // Import NgZone

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  // selectedTab: 'signup' | 'signin' = 'signup'; // This property seems to be for a tabbed UI, which is now handled by login-main.component

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private location: Location, // Used for navigateBack, though might not be needed
    private tokenService: TokenService,
    public dialogRef: MatDialogRef<RegisterComponent>, // MatDialogRef to control this specific dialog instance
    private snackBar: MatSnackBar, // MatSnackBar for user feedback
    private ngZone: NgZone // Used to run code inside Angular's zone for router navigation
  ) {
    // Initialize the registration form with validators
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        mobile_no: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // 10-digit mobile number
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$'), // At least 6 chars, alphanumeric, at least one letter and one digit
          ],
        ],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validators: passwordMatchValidator } // Custom validator for password match
    );
  }

  // selectTab(tab: 'signup' | 'signin') { // This method is likely not needed anymore
  //   this.selectedTab = tab;
  // }

  /**
   * On form submission, registers the user.
   * On successful registration, stores JWT token (assuming auto-login), closes dialog, and redirects to dashboard.
   */
  onRegister() {
    if (
      this.registerForm.valid &&
      !this.registerForm.hasError('passwordMismatch')
    ) {
      const userData = this.registerForm.value;
      // It's crucial to remove confirmPassword as your backend likely doesn't expect it
      delete userData.confirmPassword;
      // If rememberMe was part of the form, ensure it's handled or removed if not needed for backend
      // const rememberMe = this.registerForm.get('rememberMe')?.value ?? false;

      // Send registration data to your backend API
      this.http.post(`${environment.apiUrl}/register`, userData).subscribe(
        (response: any) => {
          // Show success message using MatSnackBar
          this.snackBar.open('Registration successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          console.log('User registered successfully', response);

          // Assuming the registration response includes tokens and automatically logs the user in
          this.tokenService.storeTokens(
            response.accessToken,
            response.refreshToken
          );

          // Close the registration dialog
          this.dialogRef.close();

          // Navigate to the dashboard within Angular's zone
          this.ngZone.run(() => {
            this.router.navigate(['/layout/dashboard']);
          });
        },
        (error) => {
          // Log the full error for debugging
          console.error('Error registering user', error);
          // Display a user-friendly error message
          const errorMessage =
            error?.error?.message || 'Registration failed. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        }
      );
    } else {
      // If form is invalid, mark all fields as touched to display validation errors
      this.registerForm.markAllAsTouched();
      this.snackBar.open('Please correct the errors in the form.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  /**
   * Toggles the visibility of the password input field.
   */
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  /**
   * Toggles the visibility of the confirm password input field.
   */
  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  /**
   * Checks if the password field has a minlength error and has been touched.
   * @returns True if minlength error is present and field is touched, false otherwise.
   */
  passwordLengthError() {
    return (
      this.registerForm.get('password')?.hasError('minlength') &&
      this.registerForm.get('password')?.touched
    );
  }

  /**
   * Checks if the password field has a pattern error (alphanumeric) and has been touched.
   * @returns True if pattern error is present and field is touched, false otherwise.
   */
  passwordAlphanumericError() {
    return (
      this.registerForm.get('password')?.hasError('pattern') &&
      this.registerForm.get('password')?.touched
    );
  }

  /**
   * Checks if the confirm password field has a mismatch error and has been touched.
   * @returns True if mismatch error is present and field is touched, false otherwise.
   */
  mismatchError() {
    return (
      this.registerForm.get('confirmPassword')?.touched &&
      this.registerForm.hasError('passwordMismatch')
    );
  }

  /**
   * Navigates to the login page/dialog.
   * Closes the current registration dialog first.
   */
  navigateToLogin() {
    this.dialogRef.close(); // Close current dialog
    // If you want to open the login dialog from here:
    // this.dialog.open(LoginComponent, {
    //   width: '450px',
    //   panelClass: 'attractive-dialog-panel',
    //   disableClose: false
    // });
    // Otherwise, if /login is a route:
    this.router.navigate(['/login']);
  }

  /**
   * Navigates back in the browser history.
   * This method might be less relevant if the component is primarily used as a dialog.
   */
  navigateBack() {
    this.location.back();
  }
}
