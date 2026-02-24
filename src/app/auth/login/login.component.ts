import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  NgZone,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog'; // Import MatDialogRef
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/authservice/auth.service';
import { TokenService } from 'src/app/core/services/tokenservice/token.service';
import { ForgotPasswordPopupComponent } from '../forgot-password-popup/forgot-password-popup.component';
import { Location } from '@angular/common';
import { NavigationService } from 'src/app/core/services/navigationservice/navigation.service';
import { jwtDecode } from 'jwt-decode';

// Add Google type declaration to avoid TS error
declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatDialogModule,
  ],
})
export class LoginComponent implements OnInit, AfterViewInit {
  // Implement OnInit and AfterViewInit
  @Input() isSwitchAccountMode = false;
  @Output() loginSuccess = new EventEmitter<void>();

  hidePassword: boolean = true;
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog, // MatDialog service for opening other dialogs
    private authService: AuthService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private location: Location, // Used for navigateBack, though might not be needed if dialogs are primary flow
    private navigationService: NavigationService, // Used for role-based navigation
    private ngZone: NgZone, // Used to run code inside Angular's zone for router navigation
    private http: HttpClient, // Used for direct HTTP calls if needed, though AuthService handles login
    public dialogRef: MatDialogRef<LoginComponent> // MatDialogRef to control this specific dialog instance
  ) {
    // Initialize the login form with required validators
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('^[a-zA-Z0-9]*$'), // Alphanumeric password pattern
        ],
      ],
      rememberMe: [false], // Checkbox for remember me functionality
    });
  }

  ngOnInit(): void {
    // Initialize Google Sign-In SDK when the component initializes
    if (window.google && window.google.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id:
          '282387866257-nkoqplsvhptndjn1e8spi3aaio7vkr3g.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this), // Bind 'this' to maintain context
      });
    } else {
      console.warn('Google Sign-In SDK not loaded.');
    }
  }

  ngAfterViewInit(): void {
    // Render the Google Sign-In button after the view has been initialized
    // Only render if the element exists in this component's template
    if (
      window.google &&
      window.google.accounts?.id &&
      document.getElementById('google-signin-button')
    ) {
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
        }
      );
    }
  }

  /**
   * Handles the form submission for user login.
   * On successful login, stores tokens, closes dialog, and redirects to dashboard.
   */
  onLogin(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value ?? '';
      const password = this.loginForm.get('password')?.value ?? '';
      const rememberMe = this.loginForm.get('rememberMe')?.value ?? false; // Not used in backend call, but kept for form

      // Call the authentication service to log in the user
      this.authService.login({ username: email, password }).subscribe({
        next: (response) => {
          // Store access and refresh tokens upon successful login
          this.tokenService.storeTokens(
            response.data.accessToken,
            response.data.refreshToken
          );

          // Show success message
          this.snackBar.open('Login Successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });

          // Close the login dialog
          this.dialogRef.close();

          // Navigate to the dashboard within Angular's zone
          this.ngZone.run(() => {
            this.router.navigate(['/layout/dashboard']);
          });

          // Emit event if in switch account mode (e.g., to notify parent component)
          if (this.isSwitchAccountMode) {
            this.loginSuccess.emit();
          }
        },
        error: (error: HttpErrorResponse) => this.handleLoginError(error), // Handle login errors
      });
    } else {
      // If form is invalid, mark all fields as touched to display validation errors
      this.loginForm.markAllAsTouched();
      this.snackBar.open(
        'Please fill in all required fields correctly.',
        'Close',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
    }
  }

  /**
   * Handles the credential response from Google Sign-In.
   * @param response The Google credential response object.
   */
  handleCredentialResponse(response: any): void {
    this.sendGoogleTokenToBackend(response.credential);
  }

  /**
   * Sends the Google ID token to the backend for authentication.
   * On success, stores tokens, closes dialog, and redirects to dashboard.
   * @param token The Google ID token.
   */
  sendGoogleTokenToBackend(token: string): void {
    this.authService.googleLogin(token).subscribe({
      next: (response: any) => {
        // Store access and refresh tokens from Google login response
        this.tokenService.storeTokens(
          response.data.accessToken,
          response.data.refreshToken
        );
        this.snackBar.open('Google Login Successful!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });

        // Close the login dialog
        this.dialogRef.close();

        // Navigate to the dashboard within Angular's zone
        this.ngZone.run(() => {
          this.router.navigate(['/layout/dashboard']);
        });
      },
      error: (error) => {
        console.error('Google Sign-In failed:', error);
        this.snackBar.open('Google login failed.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * Handles various HTTP error responses during login.
   * @param error The HttpErrorResponse object.
   */
  private handleLoginError(error: HttpErrorResponse): void {
    console.error(error); // Log the full error for debugging

    if (error.status === 401) {
      this.snackBar.open('Invalid username or password.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    } else if (error.status >= 500) {
      this.snackBar.open(
        'Server error occurred. Please try again later.',
        'Close',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
    } else {
      // Display a generic error message if status is not specifically handled
      this.snackBar.open(
        `${error.message || 'An unexpected error occurred.'}`,
        'Close',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
    }
  }

  /**
   * Opens the Forgot Password popup dialog.
   * Closes the current login dialog first.
   */
  ForgotPassword(): void {
    this.dialogRef.close(); // Close the current login dialog
    this.dialog.open(ForgotPasswordPopupComponent, {
      width: '450px',
      panelClass: 'attractive-dialog-panel', // Apply attractive styling
      disableClose: false, // Allow closing by clicking outside
    });
  }

  /**
   * Toggles the visibility of the password input field.
   */
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  /**
   * Checks if the password field has a minlength error and has been touched.
   * @returns True if minlength error is present and field is touched, false otherwise.
   */
  passwordLengthError(): boolean {
    const hasMinLengthError =
      this.loginForm.get('password')?.hasError('minlength') ?? false;
    const isTouched = this.loginForm.get('password')?.touched ?? false;
    return hasMinLengthError && isTouched;
  }

  /**
   * Checks if the password field has a pattern error (alphanumeric) and has been touched.
   * @returns True if pattern error is present and field is touched, false otherwise.
   */
  passwordAlphanumericError(): boolean {
    const hasPatternError =
      this.loginForm.get('password')?.hasError('pattern') ?? false;
    const isTouched = this.loginForm.get('password')?.touched ?? false;
    return hasPatternError && isTouched;
  }

  /**
   * Navigates back in the browser history.
   * This method might be less relevant if the component is primarily used as a dialog.
   */
  navigateBack(): void {
    this.location.back();
  }

  // navigateToRegister(): void {
  //   // If you want to switch from login dialog to register dialog:
  //   this.dialogRef.close(); // Close login dialog
  //   this.dialog.open(RegisterComponent, {
  //     width: '500px',
  //     panelClass: 'attractive-dialog-panel',
  //     disableClose: false
  //   });
  // }
}
