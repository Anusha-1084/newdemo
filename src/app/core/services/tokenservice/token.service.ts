import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Role } from 'src/app/role/role.enum';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  [x: string]: any;
  private readonly accessTokenKey = 'accessToken';
  private readonly refreshTokenKey = 'refreshToken';

  constructor(private cookieService: CookieService, private router: Router) {}

  /**
   * Stores the access and refresh tokens in cookies.
   * @param accessToken - The access token to store.
   * @param refreshToken - The refresh token to store.
   */
  storeTokens(accessToken: string, refreshToken: string): void {
    if (!accessToken || !refreshToken) {
      console.error('Cannot store tokens: One or both tokens are undefined');
      return;
    }
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // Adjust as needed

    const options = {
      path: '/',
      secure: true,
      sameSite: 'Strict',
      expires: expirationDate,
      // httpOnly cannot be set via JavaScript
    };

    this.cookieService.set(this.accessTokenKey, accessToken);
    this.cookieService.set(this.refreshTokenKey, refreshToken);
  }
   /** ✅ Setter for access token (for external use) */
  setAccessToken(token: string): void {
    this.cookieService.set(this.accessTokenKey, token);
  }

  /** ✅ Setter for refresh token (for external use) */
  setRefreshToken(refreshToken: string): void {
    this.cookieService.set(this.refreshTokenKey, refreshToken);
  }

  /**
   * Retrieves the stored access token.
   * @returns The access token or null if not found.
   */
  getAccessToken(): string | null {
    const token = this.cookieService.get(this.accessTokenKey);
    return token ? token : null;
  }

  /**
   * Retrieves the stored refresh token.
   * @returns The refresh token or null if not found.
   */
  getRefreshToken(): string | null {
    const token = this.cookieService.get(this.refreshTokenKey);
    return token ? token : null;
  }

  /**
   * Clears the stored tokens from cookies.
   */
  clearTokens(): void {
    this.cookieService.delete(this.accessTokenKey, '/');
    this.cookieService.delete(this.refreshTokenKey, '/');
  }

  /**
   * Decodes the JWT token.
   * @param token - The JWT token to decode.
   * @returns The decoded token payload.
   */
  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  /**
   * Retrieves the user role from the access token.
   * @returns The user role if it exists in the token or null if not found.
   */
  getUserRole(): Role | null {
  // Prefer the saved role
  const storedRole = localStorage.getItem('role');
  if (storedRole) return storedRole as Role;

  // Fallback to token decode
  const token = this.getAccessToken();
  if (!token) return null;
  const decoded = this.decodeToken(token);
  const roles = decoded?.roles || [decoded?.role];
  if (roles?.length) return this.mapServerRoleToClientRole(roles[0]);
  return null;
}


  /**
   * Checks if the access token has expired.
   * @returns true if the token has expired, false otherwise.
   */
  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const decodedToken = this.decodeToken(token);
      const expirationTime = decodedToken?.exp;
      if (!expirationTime) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      return currentTime >= expirationTime;
    } catch (error) {
      console.error('Error decoding token for expiration check', error);
      return true;
    }
  }

  /**
   * Clears expired tokens if found.
   */
  clearExpiredTokens(): void {
    if (this.isAccessTokenExpired()) {
      console.log('Access token expired, clearing tokens');
      this.clearTokens();
    }
  }

  /**
   * Maps server role strings to client Role enum.
   * @param serverRole - The role string from the server.
   * @returns The corresponding Role enum or null if not found.
   */
  public mapServerRoleToClientRole(serverRole: string): Role | null {
    switch (serverRole) {
      case 'ROLE_ADMIN':
        return Role.Admin;
      case 'ROLE_INSTRUCTOR':
        return Role.Instructor;
      case 'ROLE_USER':
        return Role.User;
      case 'ROLE_MGR':
        return Role.Manager;
      default:
        return null;
    }
  }
} 
