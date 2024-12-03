import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient,withFetch, withInterceptors } from '@angular/common/http'; 
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './interceptor/auth.interceptor';
import { TokenInterceptor } from './interceptor/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  provideRouter(routes), 
  provideClientHydration(),
  provideHttpClient(withFetch()), 
  provideAnimationsAsync(),
  
]
};
