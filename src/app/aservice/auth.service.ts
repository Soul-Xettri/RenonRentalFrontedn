import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'authToken';
  private readonly apiUrl = environment.API_URL;
  private isBrowser: boolean;
  private memoryToken: string | null = null; // For SSR compatibility

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // Set token with SSR safety
  setToken(token: string): void {
    this.memoryToken = token; // Always set in memory
    if (this.isBrowser) {
      try {
        localStorage.setItem(this.tokenKey, token);
      } catch (error) {
        console.error('Error setting token in localStorage:', error);
      }
    }
  }

  // Get token with SSR safety
  getToken(): string | null {
    if (this.isBrowser) {
      try {
        const storedToken = localStorage.getItem(this.tokenKey);
        return storedToken || this.memoryToken;
      } catch (error) {
        console.error('Error getting token from localStorage:', error);
        return this.memoryToken;
      }
    }
    return this.memoryToken;
  }

  // Clear token with SSR safety
  clearToken(): void {
    this.memoryToken = null;
    if (this.isBrowser) {
      try {
        localStorage.removeItem(this.tokenKey);
      } catch (error) {
        console.error('Error removing token from localStorage:', error);
      }
    }
  }

  getUserId(): number | null {
    try {
      const token = this.decodeToken();
      return token?.id || null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }

  getBusinessId(): number | null {
    try {
      const token = this.decodeToken();
      return token?.businessId || null;
    } catch (error) {
      console.error('Error getting business ID:', error);
      return null;
    }
  }

  // Decode JWT token safely
  decodeToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwt_decode(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  // Get logged-in role with error handling
  getLoggedInRole(): string | null {
    try {
      const token = this.decodeToken();
      return token?.role?.toLowerCase() || null;
    } catch (error) {
      console.error('Error getting logged-in role:', error);
      return null;
    }
  }

  // Check authentication status with error handling
  isAuthenticated(): boolean {
    try {
      const token = this.decodeToken();
      if (token?.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        return token.exp > currentTime;
      }
      return false;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  // Logout with error handling
  logout(): void {
    try {
      this.clearToken();
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error during logout:', error);
      // Attempt to navigate even if token clearing fails
      this.router
        .navigate(['/home'])
        .catch((navError) =>
          console.error('Navigation error during logout:', navError)
        );
    }
  }

  // API Methods with improved error handling

  createUser(signupObj: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register/user`, signupObj).pipe(
      catchError((error) => {
        console.error('Error creating user:', error);
        return throwError(
          () =>
            new Error(
              error.error?.message ||
                'User registration failed. Please try again.'
            )
        );
      })
    );
  }

  loginUser(loginObj: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, loginObj).pipe(
      catchError((error) => {
        console.error('Login API error:', error);
        return throwError(
          () =>
            new Error(
              error.error?.message ||
                'Login failed. Please check your credentials and try again.'
            )
        );
      })
    );
  }

  createBusiness(formData: FormData): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/auth/register/business`, formData)
      .pipe(
        catchError((error) => {
          console.error('Error creating business:', error);
          return throwError(
            () =>
              new Error(
                error.error?.message ||
                  'Business registration failed. Please try again.'
              )
          );
        })
      );
  }

  getBookingHistory(userId: number): Observable<any> {
    const token = this.getToken();

    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http
      .get(`${this.apiUrl}/RentalBooking/booking-history/${userId}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching booking history:', error);
          return throwError(() => new Error('Booking history not found.'));
        })
      );
  }

  getUserNotifications(userId): Observable<any> {
    const token = this.getToken();

    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http
      .get(`${this.apiUrl}/Notifications/Getnotifications`, {
        params: { userId: userId },
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching notifications:', error);
          return throwError(() => new Error('Notifications not found.'));
        })
      );
  }

  updateProfile(userId: number, userDetails): Observable<any> {
    const token = this.getToken();
    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http
      .put(`${this.apiUrl}/Auth/update-user-details/${userId}`, userDetails, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error updating user:', error);
          return throwError(
            () =>
              new Error(
                error.error?.message ||
                  'User detail update failed. Please try again.'
              )
          );
        })
      );
  }

  fetchUnReadNotificationsCount(userId): Observable<any> {
    const token = this.getToken();

    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http
      .get(`${this.apiUrl}/Notifications/notifications/unread-count`, {
        params: { userId },
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching notification count:', error);
          return throwError(
            () => new Error('Unread Notification count not found.')
          );
        })
      );
  }
}
