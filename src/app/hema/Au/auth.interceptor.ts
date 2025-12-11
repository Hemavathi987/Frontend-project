import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MasterLoginService } from '../Service/login.service';
import { catchError, switchMap, throwError } from 'rxjs';

let isRefreshing = false;

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {

  const loginService = inject(MasterLoginService);

  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('RefreshToken');
  const refreshTokenExpiry = localStorage.getItem('RefreshTokenExpiryTime');
  const role = localStorage.getItem('role');  // Admin / Employee

  // Skip login & refresh API
  if (req.url.includes('Add-Password') || req.url.includes('refresh-tocken')) {
    return next(req);
  }

  // Add access token
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401 && !isRefreshing) {

        // ❗ Only EMPLOYEE should refresh
        if (role !== "Employee") {
          return throwError(() => error);
        }

        if (!refreshToken || !refreshTokenExpiry) {
          return throwError(() => error);
        }

        const expiryTime = new Date(refreshTokenExpiry).getTime();
        const now = Date.now();

        if (now >= expiryTime) {
          return throwError(() => error);
        }

        isRefreshing = true;

        return loginService.refreshbutton(refreshToken).pipe(
          switchMap((res: any) => {
            isRefreshing = false;

            const newToken = res?.Data?.Token;
            const newRefreshToken = res?.Data?.RefreshToken;
            const newExpiry = res?.Data?.RefreshTokenExpiryTime;

            if (!newToken || !newRefreshToken || !newExpiry) {
              return throwError(() => error);
            }

            localStorage.setItem('token', newToken);
            localStorage.setItem('RefreshToken', newRefreshToken);
            localStorage.setItem('RefreshTokenExpiryTime', newExpiry);

            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            });

            return next(newReq);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
