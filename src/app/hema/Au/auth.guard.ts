import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
//route → information about the route being accessed.

//state → information about the router state.

  if (token) {
    // ✅ Token found → allow access
    return true;
  } else {
    console.warn('⛔ No token found — redirecting to login');
    router.navigate(['/master/login']);
    return false;
  }
};
//A route guard is used to control access to routes in Angular.

//CanActivate determines if a route can be activated (entered).

//Typical use case: protect routes so only authenticated users can access them.