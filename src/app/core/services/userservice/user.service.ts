import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../authservice/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService { 
  private apiUrl = 'http://localhost:8888/api/v1/users'; 

  private baseUrl = environment.baseUrl;
  private cachedUserData: any = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Method to fetch all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.authService.handleError)
    );
  }

  // Method to fetch a user by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.authService.handleError)
    );
  }

  // Method to update user information
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.authService.handleError)
    );
  }

  // Method to delete a user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.authService.handleError)
    );
  }

  requestPasswordReset(email: string): Observable<Response> {
    return this.http.post<Response>(`${this.apiUrl}/request-password-reset`, { email }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.authService.handleError)
    );
  }
  
  resetPassword(token: string, newPassword: string): Observable<Response> {
    return this.http.post<Response>(`${this.apiUrl}/reset-password`, { token, newPassword }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.authService.handleError)
    );
  }  

   getUserProfile(): Observable<any> {
    if (this.cachedUserData) {
      return of(this.cachedUserData); // Return cached data
    }

    const token = this.authService.getAccessToken();
    if (!token) {
      console.error('Token not available. User not authenticated.');
      return of(null);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.baseUrl}/api/v1/users/profile`, { headers }).pipe(
      tap(data => this.cachedUserData = data) // Cache result
    );
  }
  clearUserProfileCache() {
    this.cachedUserData = null;
  }
}