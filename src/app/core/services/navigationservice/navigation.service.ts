import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Role } from 'src/app/role/role.enum';
import { TokenService } from '../tokenservice/token.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private tokenService: TokenService
  ) {}

  navigateBasedOnRole(): void {
    const role = this.tokenService.getUserRole();
    console.log('Role:', role);

    if (role) {
      if (role === Role.Admin) {
        this.router.navigate(['/admin-layout/admin-dashboard']);
      } else if (role === Role.Instructor) {
        this.router.navigate(['/instructor-layout']);
      } else if (role === Role.User) {
        this.router.navigate(['/layout/dashboard']);
      } else {
        console.warn('Unrecognized role:', role);
        this.router.navigate(['/unauthorized']);
      }
    } else {
      console.error('Invalid role value:', role);
      this.snackBar.open('Unauthorized access.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      this.router.navigate(['/login']);
    }
  }
}