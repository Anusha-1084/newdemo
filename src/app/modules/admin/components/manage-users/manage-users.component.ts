import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/core/services/tokenservice/token.service';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile_no: string;
  roles: string[];
}
@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  searchFilter: string = 'All'; 
  searchPlaceholder: string = 'Get All User Data';
  searchTerm: string = '';
  roleFilter: string = 'all';
  users: User[] = []; 
  filteredUsers: User[] = []; 

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private route: ActivatedRoute
  ) {
    this.filteredUsers = [...this.users];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.roleFilter = params['role'] || 'all';
      this.fetchUsers();
    });
  }

  fetchUsers(): void {
    const token = this.tokenService.getAccessToken();
    
    if (!token) {
      this.handleError('User is not authenticated. Please log in again.');
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
 
    let params = new HttpParams();
    if (this.roleFilter !== 'all') {
      params = params.append('role', this.roleFilter);
    }
  
    const url = 'http://localhost:8888/api/v1/users';
  
    // Perform the HTTP GET request
    this.http.get<any>(url, { headers, params }).subscribe(
      (response) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.users = response.data;
          this.filterUsers();
        } else {
          console.error('Invalid user data in response', response);
          this.handleError('Failed to fetch users. Please try again later.');
        }
      },
      (error) => this.handleErrorFromHttp(error)
    );
  }

  private handleError(message: string): void {
    alert(message);
  }

  private handleErrorFromHttp(error: any): void {
    console.error('Error fetching users:', error);
    if (error.status === 401) {
      this.handleError('Unauthorized access. Please log in again.');
    } else if (error.status === 500) {
      this.handleError('Server error. Please try again later.');
    } else {
      this.handleError('Failed to fetch users. Please try again later.');
    }
  }
  

  filterUsers() {
    if (this.roleFilter === 'all') {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.roles.includes(`ROLE_${this.roleFilter.toUpperCase()}`)
      );
    }
  }

  updatePlaceholder() {
    switch (this.searchFilter) {
      case 'All':
        this.searchPlaceholder = 'Get All User Data';
        break;
      case 'name':
        this.searchPlaceholder = 'Search by Name';
        break;
      case 'id':
        this.searchPlaceholder = 'Search by ID';
        break;
      case 'username':
        this.searchPlaceholder = 'Search by Username';
        break;
      case 'email':
        this.searchPlaceholder = 'Search by Email';
        break;
      case 'mobile':
        this.searchPlaceholder = 'Search by Mobile';
        break;
      default:
        this.searchPlaceholder = '';
    }
  }

  onSearch(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    switch (this.searchFilter) {
      case 'All':
        this.filteredUsers = [...this.users];
        break;
      case 'name':
        this.filteredUsers = this.users.filter(user =>
          user.username.toLowerCase().includes(searchTermLower)
        );
        break;
      case 'id':
        this.filteredUsers = this.users.filter(user =>
          user.id.toString().includes(this.searchTerm)
        );
        break;
      case 'username':
        this.filteredUsers = this.users.filter(user =>
          user.username.toLowerCase().includes(searchTermLower)
        );
        break;
      case 'email':
        this.filteredUsers = this.users.filter(user=>
          user.email.toLowerCase().includes(this.searchTerm)
        );
        break;
      case 'mobile':
        this.filteredUsers = this.users.filter(user =>
          user.mobile_no.toLowerCase().includes(this.searchTerm)
        );
        break;
      default:
        this.filteredUsers = [...this.users];
    }
    if (this.filteredUsers.length === 0) {
      alert('User not found');
      this.filteredUsers = [...this.users];
    }
  }

  onView(userId: number): void {
    alert('Viewing details for User ID: ' + userId);
  }

  onUpdate(userId: number): void {
    alert('Updating User ID: ' + userId);
  }

  onDelete(userId: number): void {
    const token = this.tokenService.getAccessToken();
    if (!token) {
      alert('User is not authenticated. Please log in again.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8888/api/v1/users/${userId}`;
    this.http.delete(url, { headers }).subscribe(
      () => {
        this.users = this.users.filter(user => user.id !== userId);
        this.filteredUsers = [...this.users];
        alert('User successfully deleted!');
      },
      (error) => {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again later.');
      }
    );
  }
}
