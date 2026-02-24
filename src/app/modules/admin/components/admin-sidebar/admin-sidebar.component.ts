import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/authservice/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    MatIconModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent {

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
