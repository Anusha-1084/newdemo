import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from '../services/authservice/auth.service';
import { TokenService } from '../services/tokenservice/token.service'; // ✅ Added

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService); // ✅ Added

  const refreshTokenSubject = new BehaviorSubject<string | null>(null);
  let isRefreshing = false;

  // ✅ Get token from cookie-based TokenService
  const accessToken = tokenService.getAccessToken();

  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && authService.hasRefreshToken()) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshAccessToken().pipe(
            switchMap((response: any) => {
              isRefreshing = false;
              const newToken = response?.accessToken;

              if (newToken) {
                // ✅ Store new token using TokenService (cookie)
                tokenService.storeTokens(newToken, tokenService.getRefreshToken() || '');


                refreshTokenSubject.next(newToken);

                const clonedRequest = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`,
                  },
                });
                return next(clonedRequest);
              } else {
                authService.logout();
                return throwError(() => new Error('Session expired. Please log in again.'));
              }
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              console.error('Access token refresh failed:', refreshError);
              authService.logout();
              return throwError(() => new Error('Session expired. Please log in again.'));
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter((token) => token != null),
            take(1),
            switchMap((token) => {
              const clonedRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`,
                },
              });
              return next(clonedRequest);
            })
          );
        }
      } else {
        return throwError(() => error);
      }
    })
  );
};
