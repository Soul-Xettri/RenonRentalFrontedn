import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient,private authService:AuthService) {}

  initiatePaymentApi(data): Observable<any> {
    // Retrieve the token from AuthService
    const token = this.authService.getToken();

    if (!token) {
      // Handle the case when token is not available
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }
    
    // Create headers and include the Authorization header
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      // No need to set 'Content-Type' for FormData
    });
    // Include the headers in the options parameter
    debugger;
    return this.http
      .post(`${environment.API_URL}/payment`, data, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error adding vehicle:', error);
          return throwError(() => new Error('Vehicle registration failed.'));
        })
      );
  }

  
}
