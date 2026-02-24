import { inject, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { TokenService } from '../services/tokenservice/token.service';
import { AuthService } from '../services/authservice/auth.service';;
import { switchMap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> => {
    const tokenService = inject(TokenService);
    const router = inject(Router);
    const authService = inject(AuthService);
    const token = tokenService.getAccessToken();
    if (token) {
      try {
        const decodedToken: any = jwt_decode.jwtDecode(token);
        if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
          console.warn('Token expired, attempting to refresh...');

    
          return authService.refreshAccessToken().pipe(
            switchMap(() => {
              return new Observable<boolean>((observer) => observer.next(true));
            }),
            catchError((error) => {
      
              console.error('Unable to refresh token, redirecting to login',error);
              tokenService.clearTokens();
     
          router.navigate(['/login']);
          return new Observable<boolean>((observer) => observer.next(false));
        })
      );
     }
      return new Observable<boolean>((observer) => observer.next(true));
    } catch (error) {
      console.error('Invalid token', error);
      tokenService.clearTokens();
      router.navigate(['/login']);
      return new Observable<boolean>((observer) => observer.next(false));
    }
  }
    console.log('No token found');
    router.navigate(['/login']);
    return new Observable<boolean>((observer) => observer.next(false));
  }; 
