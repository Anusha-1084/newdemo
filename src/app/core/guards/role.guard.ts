import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/tokenservice/token.service';
import { Role } from 'src/app/role/role.enum';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router, private tokenService: TokenService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredRoles: Role[] = next.data['roles'] || [];
    const userRole: Role | null = this.tokenService.getUserRole(); 
    console.log('RoleGuard: Required roles:', requiredRoles);
    console.log('RoleGuard: User role:', userRole);

    if (!userRole || !requiredRoles.includes(userRole)) {
      console.error('RoleGuard: Access denied. User role:', userRole, 'Required roles:', requiredRoles);
    

      this.router.navigate(['/layout/timesheet/homepage']); // redirect to home
      return false;
    }
    console.log('RoleGuard: Access granted');
    return true;
  }
}
 