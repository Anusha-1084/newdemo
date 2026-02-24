import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/authservice/auth.service';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar-component',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    RouterModule,
    RegisterComponent,
    LoginComponent,
    FormsModule,
    EditProfileComponent
  ],
  templateUrl: './sidebar-component.component.html',
  styleUrl: './sidebar-component.component.scss',
})
export class SidebarComponentComponent implements OnInit {
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  private baseUrl = environment.baseUrl;
  userId: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  @Input() isSidebarOpen = false;

  statusOptions: string[] = ['ONLINE', 'OFFLINE', 'IN_MEETING'];

  userData: any = null;
  isLoading: boolean = true;

  showAddAccountBox = false;
  showSwitchAccountBox = false;

  previewUrl: string | null = null;

  switchEmail: string = '';
  switchPassword: string = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private userDataService: UserDataService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getId();

    this.userDataService.userData$.subscribe((data) => {
      if (data) {
        this.userData = data;
        this.firstName = data.firstName;
        this.lastName = data.lastName;

        if (data.profileImageUrl?.startsWith('data:image')) {
          this.previewUrl = data.profileImageUrl;
        } else if (data.profileImageUrl) {
          this.previewUrl = `${this.baseUrl}/${data.profileImageUrl}`;
        }

        this.cdr.detectChanges();
      }
    });

    // 🚀 Auto-close sidebar & popups when navigating to edit-profile
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url.includes('/edit-profile')) {
          this.isSidebarOpen = false;
          this.showAddAccountBox = false;
          this.showSwitchAccountBox = false;
        }
      });
  }

  logout() {
    this.authService.logout();
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login-main']);
  }

  getUserDetails(userId: string): void {
    const url = `${this.baseUrl}/api/v1/users/${userId}`;
    this.http.get<any>(url).subscribe(
      (response) => {
        const userData = response.data;
        this.firstName = userData.firstName;
        this.lastName = userData.lastName;
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  loadUserProfile() {
    const url = `${this.baseUrl}/api/v1/users/profile`;
    const token = this.authService.getAccessToken();

    if (!token) {
      console.error('Token not available. User not authenticated.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<any>(url, { headers }).subscribe(
      (response) => {
        this.userData = {
          ...response,
          status: response.status || 'Online',
        };

        if (this.userData.profileImageUrl?.startsWith('data:image')) {
          this.previewUrl = this.userData.profileImageUrl;
        } else if (this.userData.profileImageUrl) {
          this.previewUrl = `${this.baseUrl}/${this.userData.profileImageUrl}`;
        }

        this.isLoading = false;
        this.userDataService.setUserData(this.userData);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error loading profile data', error);
        this.isLoading = false;
      }
    );
  }

  onStatusChange() {
    const url = `${this.baseUrl}/api/v1/users/status`;
    const token = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = { status: this.userData.status };

    this.http.put(url, body, { headers }).subscribe(
      (response) => {
        console.log('Status updated successfully:', response);
      },
      (error) => {
        console.error('Error updating status:', error);
      }
    );
  }

  openAddAccount() {
    this.showAddAccountBox = true;
    this.showSwitchAccountBox = false;
  }

  openSwitchAccount() {
    this.showSwitchAccountBox = true;
    this.showAddAccountBox = false;
  }

  closePopup() {
    this.showAddAccountBox = false;
    this.showSwitchAccountBox = false;
    this.userId = this.authService.getId();
    if (this.userId) {
      this.getUserDetails(this.userId);
      this.loadUserProfile();
    }
    this.cdr.detectChanges();
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  switchAccount(): void {
    const url = `${this.baseUrl}/auth/switch-account`;

    const body = {
      email: this.switchEmail,
      password: this.switchPassword,
    };

    this.http.post<any>(url, body).subscribe(
      (response) => {
        if (response.data?.token) {
          this.authService.setToken(response.data.token);
          this.authService.setRefreshToken(response.data.refreshToken);

          this.closePopup();
        } else {
          alert('Unexpected response format.');
        }
      },
      (error) => {
        alert(error?.error?.message || 'User not found or invalid credentials.');
      }
    );
  }

  openEditProfile(): void {
    // 🚀 Force reset everything
    this.showAddAccountBox = false;
    this.showSwitchAccountBox = false;
    this.closeSidebar();

    // Navigate to edit profile page
    this.router.navigate(['/edit-profile']);
  }
}
