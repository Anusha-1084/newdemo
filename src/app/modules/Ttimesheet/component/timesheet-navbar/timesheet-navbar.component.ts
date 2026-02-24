import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from 'src/app/core/services/tokenservice/token.service';
import { jwtDecode } from 'jwt-decode';  // ✅ Correct import
import { Role } from 'src/app/role/role.enum';

@Component({
  selector: 'app-timesheet-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './timesheet-navbar.component.html',
  styleUrls: ['./timesheet-navbar.component.scss']
})
export class TimesheetNavbarComponent implements OnInit {
  topNavbarVisible: boolean = true;
  currentUserRoles: string[] = [];

  constructor(private tokenService: TokenService) {}

  ngOnInit(): void {
    const token = this.tokenService.getAccessToken();

    if (token) {
      try {
        const decoded: any = jwtDecode(token);  // ✅ fixed
        console.log('Decoded JWT:', decoded);

        this.currentUserRoles = this.extractRoles(decoded);
        console.log('Current User Roles:', this.currentUserRoles);

      } catch (error) {
        console.error('Error decoding token:', error);
        this.currentUserRoles = [];
      }
    } else {
      console.warn('No access token found');
    }
  }

  private extractRoles(decodedToken: any): string[] {
    if (!decodedToken) return [];

    const possibleProps = ['roles', 'authorities', 'authority', 'scope', 'permissions'];

    for (const prop of possibleProps) {
      const roles = decodedToken[prop];

      if (roles) {
        if (Array.isArray(roles) && typeof roles[0] === 'string') {
          return roles;
        }

        // If the roles are objects → convert to strings
        if (Array.isArray(roles) && typeof roles[0] === 'object') {
          return roles.map((r: any) => r.authority || r.role || r.name);
        }

        if (typeof roles === 'string') return [roles];
      }
    }

    return [];
  }

  isUser(): boolean {
    return this.currentUserRoles.includes(Role.User);
  }

  isAdmin(): boolean {
    return this.currentUserRoles.includes(Role.Admin);
  }

  isManager(): boolean {
    return this.currentUserRoles.includes(Role.Manager);
  }

  isApprover(): boolean {
    return this.isAdmin() || this.isManager();
  }
}