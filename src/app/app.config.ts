import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './hema/Au/auth.interceptor';
import { MessageService } from 'primeng/api';

export const AppConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),   // sets up routing for your app
    provideHttpClient(),
     provideAnimations(),
      MessageService, 
        provideHttpClient(
      withInterceptors([AuthInterceptor])
    ), // ✅ allows multiple interceptor  
  ]
};


