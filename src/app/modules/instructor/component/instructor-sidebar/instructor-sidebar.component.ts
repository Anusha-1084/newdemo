import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/core/services/authservice/auth.service';

@Component({
  selector: 'app-instructor-sidebar',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './instructor-sidebar.component.html',
  styleUrl: './instructor-sidebar.component.scss'
})
export class InstructorSidebarComponent {
  userId: string | null = null
  firstName: string | null = null
  lastName: string | null = null
  constructor(private authService: AuthService,
    private http: HttpClient,
  ) {}
    @Input() isSidebarOpen = false;
   
  
    logout(){
      this.authService.logout();
    }
  ngOnInit() {
    this.userId = this.authService.getId();
    console.log('Decoded User ID:', this.userId);

    if (this.userId) {
      this.getUserDetails(this.userId);
    }
  }


  getUserDetails(userId: string): void {
    const url = `http://localhost:8888/api/v1/users/${userId}`;
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
}
