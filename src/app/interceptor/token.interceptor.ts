import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { AuthService } from "../aservice/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private authService: AuthService
      ) {}


  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    // add authorization header with jwt token if available
    const token = this.authService.getToken();
    if (token) {
      request = this.addToken(request, token);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    request = request.clone({
      //url: environment.API_URL + request.url,
      headers: headers,
    });

    // return next.handle(request);
    return next.handle(request).pipe(
      catchError((error) => {
        if (localStorage.length > 0) {
            localStorage.clear();
            this.router.navigateByUrl("/login");
          }
          return throwError(error);
      })
    );
  }

 

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private addRequestUri(request: HttpRequest<any>) {
    return request.clone({
      url: request.url,
    });
  }
}
