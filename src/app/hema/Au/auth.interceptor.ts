import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  console.log('Interceptor executing, token:', token);

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Added header:', cloned.headers.get('Authorization'));
    return next(cloned);
  } else {
    console.warn('No token found in localStorage');
    return next(req);
  }
};
