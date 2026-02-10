import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MasterLoginService } from '../Service/login.service';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError
} from 'rxjs';

/* =======================
   GLOBAL STATE
   ======================= */
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(MasterLoginService);
  const messageService = inject(MessageService);

  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('RefreshToken');
  const refreshTokenExpiry = localStorage.getItem('RefreshTokenExpiryTime');
  const role = localStorage.getItem('role'); // Admin | Employee

  /* =======================
     SKIP AUTH FOR THESE APIs
     ======================= */
  if (
    req.url.includes('Add-Password') ||
    req.url.includes('refresh-tocken')
  ) {
    return next(req);
  }

  /* =======================
     ADD ACCESS TOKEN
     ======================= */
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  /* =======================
     MESSAGE ONLY HANDLER
     ======================= */
  const showMessageOnly = (message: string) => {
    messageService.add({
      severity: 'warn',
      summary: 'Authentication',
      detail: message
    });

    // ❌ NO logout
    // ❌ NO navigation
    // ❌ NO localStorage clear

    return throwError(() => new HttpErrorResponse({ status: 401 }));
  };

  /* =======================
     REQUEST PIPELINE
     ======================= */
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Pass non-401 errors
      if (error.status !== 401) {
        return throwError(() => error);
      }

      /* =======================
         ADMIN → MESSAGE ONLY
         ======================= */
      if (role === 'Admin') {
        return showMessageOnly(
          'Admin session expired. Please re-login when convenient.'
        );
      }

      /* =======================
         EMPLOYEE → TRY REFRESH
         ======================= */
      if (role === 'Employee') {
        // Missing refresh data → message only
        if (!refreshToken || !refreshTokenExpiry) {
          return showMessageOnly(
            'Session expired. Please login again.'
          );
        }

        const expiryTime = Date.parse(refreshTokenExpiry);
        if (isNaN(expiryTime)) {
          return showMessageOnly(
            'Session expired. Please login again.'
          );
        }

        /* =======================
           REFRESH FLOW
           ======================= */
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return loginService.refreshbutton(refreshToken).pipe(
            switchMap((res: any) => {
              isRefreshing = false;

              const newToken = res?.Data?.Token;
              const newRefreshToken = res?.Data?.RefreshToken;
              const newExpiry = res?.Data?.RefreshTokenExpiryTime;

              if (!newToken || !newRefreshToken || !newExpiry) {
                return showMessageOnly(
                  'Session expired. Please login again.'
                );
              }

              // Save refreshed tokens
              localStorage.setItem('token', newToken);
              localStorage.setItem('RefreshToken', newRefreshToken);
              localStorage.setItem(
                'RefreshTokenExpiryTime',
                newExpiry
              );

              refreshTokenSubject.next(newToken);

              // Retry original request
              return next(
                req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                })
              );
            }),
            catchError(() => {
              isRefreshing = false;
              return showMessageOnly(
                'Session expired. Please login again.'
              );
            })
          );
        }

        /* =======================
           WAIT FOR REFRESH
           ======================= */
        return refreshTokenSubject.pipe(
          filter(t => t !== null),
          take(1),
          switchMap(t =>
            next(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${t}`
                }
              })
            )
          )
        );
      }

      return throwError(() => error);
    })
  );
};
