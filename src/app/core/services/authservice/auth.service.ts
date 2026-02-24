import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { TokenService } from '../tokenservice/token.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private courseUrl = environment.courseUrl;

  private userStatusSubject = new BehaviorSubject<string>('ONLINE');
  userStatus$ = this.userStatusSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {}

  setToken(token: string): void {
    this.tokenService.setAccessToken(token);
  }

  setRefreshToken(refreshToken: string): void {
    this.tokenService.setRefreshToken(refreshToken);
  }

  setCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
  }

  setUserStatus(status: string): void {
    this.userStatusSubject.next(status);
  }

  postData(data: { name: string; description: string; }): Observable<any> {
    const token = this.tokenService.getAccessToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(this.courseUrl, data, { headers });
  }

  getId(): string | null {
    const token = this.tokenService.getAccessToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.id || null;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    console.warn('No token found in cookies');
    return null;
  }

  register(user: User): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/register`, user, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
    map((response: any) => {
      // Handle different response structures safely
      const data = response?.data || response;
      const accessToken = data?.accessToken;
      const refreshToken = data?.refreshToken;
      const role = data?.role;
      
      // ✅ Store tokens
      if (accessToken && refreshToken) {
        this.tokenService.storeTokens(accessToken, refreshToken);
      }

      // ✅ Store role in localStorage for RoleGuard
      if (role) {
        localStorage.setItem('role', role);
      }

       // ⭐ EXTRACT USER ID FROM TOKEN
      const userId = this.getId();
      if (userId) {
      localStorage.setItem('userId', userId);
      }

      // ✅ Optional: set current user observable
      this.setCurrentUser({ username: credentials.username, role });

      return response;
    }),
    catchError(this.handleError)
  );
}
  refreshAccessToken(): Observable<any> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('Refresh token is missing.'));
    }

    return this.http
      .post<any>(`${this.apiUrl}/refresh-token`, { refreshToken }, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        map((response) => {
          this.tokenService.storeTokens(response.accessToken, response.refreshToken);
          return response;
        }),
        catchError((error) => {
          this.logout();
          return throwError(() => new Error('Session expired. Please log in again.'));
        })
      );
  }
getUserDetails() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

  getAccessToken(): string | null {
    const token = this.tokenService.getAccessToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          console.error('Access token has expired');
          this.tokenService.clearTokens();
          return null;
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return token;
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post(`${this.apiUrl}/refresh-token`, { refreshToken });
  }

  hasRefreshToken(): boolean {
    return !!this.tokenService.getRefreshToken();
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getAccessToken();
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  public handleError(error: HttpErrorResponse): Observable<never> {
    console.error('HTTP Error:', error);
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side Error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side Error: ${error.status} - ${error.message}`;
      if (error.status === 401 && error.error?.message) {
        errorMessage = `${error.error.message}`;
      } else if (error.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      }
    }
    return throwError(() => new Error(errorMessage));
  }

  googleLogin(googleToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/google`, { googleToken }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      map((response) => {
        this.tokenService.storeTokens(response.data.accessToken, response.data.refreshToken);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  switchAccount(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/switch-account`, credentials, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      map((response: any) => {
        if (response.data && response.data.token && response.data.refreshToken) {
          this.setToken(response.data.token);
          this.setRefreshToken(response.data.refreshToken);
          this.setCurrentUser({ token: response.data.token });
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }
}
