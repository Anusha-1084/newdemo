// import {
//   Component,
//   Output,
//   EventEmitter,
//   OnInit,
//   OnDestroy,
// } from '@angular/core';
// import { AuthService } from 'src/app/core/services/authservice/auth.service';
// import { MatIconModule } from '@angular/material/icon';
// import { RouterModule, Router } from '@angular/router';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { environment } from 'src/environments/environment';
// import { Subscription } from 'rxjs';
// import { UserDataService } from 'src/app/core/services/user-data.service';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [MatIconModule, RouterModule, CommonModule],
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.scss'],
// })
// export class NavbarComponent implements OnInit, OnDestroy {
//   firstNameInitial: string | null = null;
//   lastNameInitial: string | null = null;
//   userId: string | null = null;
//   status: string = 'ONLINE';
//   navbarVisible: boolean = false;

//   private userDataSubscription!: Subscription;
//   private statusSubscription!: Subscription;
//   private hideTimeout: any;
//   private isMouseOverNavbar: boolean = false;

//   @Output() profileClicked = new EventEmitter<void>();
//   isProfileBoxVisible: boolean = false;

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private http: HttpClient,
//     private userDataService: UserDataService
//   ) {}

//   ngOnInit() {
//     this.userId = this.authService.getId();
//     if (this.userId) this.getUserDetails(this.userId);

//     this.statusSubscription = this.authService.userStatus$.subscribe(
//       (status: string) => {
//         this.status = status.toUpperCase();
//       }
//     );

//     this.userDataSubscription = this.userDataService.userData$.subscribe((userData) => {
//       if (userData) {
//         this.setInitials(userData.firstName, userData.lastName);
//         this.status = userData.status ? userData.status.toUpperCase() : 'N';
//       }
//     });

//     document.addEventListener('mousemove', this.handleMouseMove.bind(this));
//   }

//   ngOnDestroy() {
//     if (this.statusSubscription) this.statusSubscription.unsubscribe();
//     if (this.userDataSubscription) this.userDataSubscription.unsubscribe();
//     document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
//   }

//   showNavbar(): void {
//     this.navbarVisible = true;
//     clearTimeout(this.hideTimeout);
//   }

//   scheduleHideNavbar(): void {
//     this.hideTimeout = setTimeout(() => {
//       if (!this.isMouseOverNavbar) {
//         this.navbarVisible = false;
//       }
//     }, 600);
//   }

//   handleMouseMove(event: MouseEvent): void {
//     const topZone = 10;
//     if (event.clientY <= topZone || this.isMouseOverNavbar) {
//       this.showNavbar();
//     } else {
//       this.scheduleHideNavbar();
//     }
//   }

//   onMouseEnterNavbar(): void {
//     this.isMouseOverNavbar = true;
//     this.showNavbar();
//   }

//   onMouseLeaveNavbar(): void {
//     this.isMouseOverNavbar = false;
//     this.scheduleHideNavbar();
//   }

//   onCartIconClick(): void {
//     this.isProfileBoxVisible = !this.isProfileBoxVisible;
//     this.profileClicked.emit();
//   }

//   getUserDetails(userId: string): void {
//     const token = this.authService.getAccessToken();
//     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
//     const url = `${environment.baseUrl}/api/v1/users/profile`;

//     this.http.get<any>(url, { headers }).subscribe(
//       (res) => {
//         this.setInitials(res.firstName, res.lastName);
//         this.status = res.status ? res.status.toUpperCase() : 'N';
//         this.userDataService.setUserData(res);
//       },
//       (err) => console.error('Error fetching user details:', err)
//     );
//   }

//   private setInitials(first: string, last: string): void {
//     this.firstNameInitial = first ? first.charAt(0).toUpperCase() : 'N';
//     this.lastNameInitial = last ? last.charAt(0).toUpperCase() : 'N';
//   }
// }







import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { AuthService } from 'src/app/core/services/authservice/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router'; // Import Router
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { TokenService } from 'src/app/core/services/tokenservice/token.service'; // Import TokenService
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule], // Ensure RouterModule and CommonModule are here
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  firstNameInitial: string | null = null;
  lastNameInitial: string | null = null;
  userId: string | null = null;
  status: string = 'ONLINE';
  navbarVisible: boolean = false;

  private userDataSubscription!: Subscription;
  private statusSubscription!: Subscription;
  private hideTimeout: any;
  private isMouseOverNavbar: boolean = false;

  @Output() profileClicked = new EventEmitter<void>();
  isProfileBoxVisible: boolean = false; // This seems related to a profile dropdown, not directly logout

  constructor(
    private authService: AuthService,
    private router: Router, // Inject Router
    private http: HttpClient,
    private userDataService: UserDataService,
    private tokenService: TokenService, // Inject TokenService
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  ngOnInit() {
    this.userId = this.authService.getId(); // Assuming getId() gets the user ID
    if (this.userId) {
      this.getUserDetails(this.userId);
    } else {
      // If userId is not immediately available, try to get user data from TokenService
      // or ensure getUserDetails handles null userId gracefully.
      // Alternatively, check if a token exists to determine if a user is logged in.
      if (this.tokenService['hasValidToken']()) {
        // You might want to fetch user details based on token if userId isn't directly from authService.getId()
        // For now, let's assume getUserDetails can work with a token or a user ID that becomes available.
      }
    }


    this.statusSubscription = this.authService.userStatus$.subscribe(
      (status: string) => {
        this.status = status.toUpperCase();
      }
    );

    this.userDataSubscription = this.userDataService.userData$.subscribe((userData) => {
      if (userData) {
        this.setInitials(userData.firstName, userData.lastName);
        this.status = userData.status ? userData.status.toUpperCase() : 'N';
      } else {
        // If user data becomes null (e.g., after logout), clear initials
        this.firstNameInitial = null;
        this.lastNameInitial = null;
      }
    });

    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  ngOnDestroy() {
    if (this.statusSubscription) this.statusSubscription.unsubscribe();
    if (this.userDataSubscription) this.userDataSubscription.unsubscribe();
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  showNavbar(): void {
    this.navbarVisible = true;
    clearTimeout(this.hideTimeout);
  }

  scheduleHideNavbar(): void {
    this.hideTimeout = setTimeout(() => {
      if (!this.isMouseOverNavbar) {
        this.navbarVisible = false;
      }
    }, 600);
  }

  handleMouseMove(event: MouseEvent): void {
    const topZone = 10;
    if (event.clientY <= topZone || this.isMouseOverNavbar) {
      this.showNavbar();
    } else {
      this.scheduleHideNavbar();
    }
  }

  onMouseEnterNavbar(): void {
    this.isMouseOverNavbar = true;
    this.showNavbar();
  }

  onMouseLeaveNavbar(): void {
    this.isMouseOverNavbar = false;
    this.scheduleHideNavbar();
  }

  onCartIconClick(): void {
    this.isProfileBoxVisible = !this.isProfileBoxVisible;
    this.profileClicked.emit();
  }

  getUserDetails(userId: string): void {
    const token = this.authService.getAccessToken(); // Assuming authService provides access token
    if (!token) {
      console.warn('No access token available to fetch user details.');
      return;
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${environment.baseUrl}/api/v1/users/profile`; // Adjust URL if needed

    this.http.get<any>(url, { headers }).subscribe(
      (res) => {
        this.setInitials(res.firstName, res.lastName);
        this.status = res.status ? res.status.toUpperCase() : 'N';
        this.userDataService.setUserData(res); // Update shared user data service
      },
      (err) => {
        console.error('Error fetching user details:', err);
        // Handle token expiration or invalid token here, e.g., force logout
        if (err.status === 401 || err.status === 403) {
          this.logout();
        }
      }
    );
  }

  private setInitials(first: string, last: string): void {
    this.firstNameInitial = first ? first.charAt(0).toUpperCase() : null;
    this.lastNameInitial = last ? last.charAt(0).toUpperCase() : null;
  }

  /**
   * Handles the logout functionality.
   * Clears tokens and redirects to the landing page.
   */
  logout(): void {
    this.tokenService.clearTokens(); // Clear tokens from local storage
    this.snackBar.open('You have been logged out.', 'Close', { duration: 3000, panelClass: ['success-snackbar'] }); // Show feedback
    this.router.navigate(['/']); // Redirect to the landing page (root)
  }
}