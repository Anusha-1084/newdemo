import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/authservice/auth.service';


@Component({
  selector: 'app-instructor-navbar',
  standalone: true,
  imports: [
    MatIconModule,
    RouterModule,
    CommonModule,

  ],
  templateUrl: './instructor-navbar.component.html',
  styleUrl: './instructor-navbar.component.scss'
})
export class InstructorNavbarComponent {
  userId: string | null = null
    firstNameInitial: string | null = null
    lastNameInitial: string | null = null
    constructor(
      private authService: AuthService,
      private router: Router,
      private http: HttpClient,
    ) {}
  
    @Output() profileClicked = new EventEmitter<void>();
    onCartIconClick(): void {
      this.profileClicked.emit();
    }
    logout() {
      this.authService.logout();
      alert('User logged out successfully');
      this.router.navigate(['/login']);
    }
  
    
  
    ngOnInit() {
      this.userId = this.authService.getId();
  
      if(this.userId){
        this.getUserDetails(this.userId);
      }
    }
  
  
    getUserDetails(userId: string): void {
      const url = `http://localhost:8888/api/v1/users/${userId}`;
      this.http.get<any>(url).subscribe(
        (response) => {
          if (response) {
          const userData = response.data;
          this.firstNameInitial = userData.firstName ? userData.firstName.charAt(0).toUpperCase() : 'N';
          this.lastNameInitial = userData.lastName ? userData.lastName.charAt(0).toUpperCase() : 'N';
        } else {
          console.error('User data is not available in the response');
          alert('Failed to retrieve user data. Please try again later.');
        }
      },
      (error) => {
        console.error('Error fetching user details:', error);
        if (error.status === 401) {
          alert('Unauthorized access. Please log in again.');
        } else if (error.status === 500) {
          alert('Server error. Please try again later.');
        } else {
          alert('Failed to fetch user details. Please try again later.');
        }
      }
    );
    }
  } 