import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  private BusinessId: number | null = null;
  private readonly apiUrl = environment.API_URL;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedId = localStorage.getItem('businessId');
      if (storedId) {
        this.BusinessId = parseInt(storedId);
      }
    }
  }

  setBusinessId(id: number): void {
    this.BusinessId = id;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('businessId', id.toString());
    }
  }

  getBusinessId(): number | null {
    return this.BusinessId;
  }

  clearBusinessId(): void {
    this.BusinessId = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('businessId');
    }
  }

  getBusinessDetails(businessId: number, vehicleType: number): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .post(
        `${this.apiUrl}/VehicleRental/business-details`,
        { businessId: businessId, vehicleType: vehicleType },
        {
          headers,
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching vehicle details:', error);
          return throwError(() => new Error('Vehicle details not found.'));
        })
      );
  }

  getBusinessBookings(businessId: number): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(`${this.apiUrl}/RentalBooking/business/${businessId}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching vehicle bookings:', error);
          return throwError(() => new Error('Vehicle bookings not found.'));
        })
      );
  }

  acceptRental(rentalId: number): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .post(
        `${this.apiUrl}/VehicleRental/accept-rental`,
        { rentalId },
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Error accepting rental:', error);
          return throwError(() => new Error('Rental acceptance failed.'));
        })
      );
  }

  rejectRental(rentalId: number): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .post(
        `${this.apiUrl}/VehicleRental/reject-rental`,
        { rentalId },
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Error rejecting rental:', error);
          return throwError(() => new Error('Rental rejection failed.'));
        })
      );
  }

  fetchBusinessNotifications(businessId): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(`${this.apiUrl}/Notifications/Getnotifications`, {
        params: { businessId: businessId },
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching business notifications:', error);
          return throwError(() => new Error('Notifications not found.'));
        })
      );
  }

  markNotificationAsRead(notificationId): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .post(
        `${this.apiUrl}/Notifications/notifications/mark-as-read`,
        { notificationId },
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Error rejecting rental:', error);
          return throwError(
            () => new Error('Notification failed to mark as read.')
          );
        })
      );
  }

  fetchUnReadNotificationsCount(businessId): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http
      .get(`${this.apiUrl}/Notifications/notifications/unread-count`, {
        params: { businessId },
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

  confirmRental(rentalId: number, paymentType: number): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .post(
        `${this.apiUrl}/VehicleRental/confirm`,
        { rentalId, paymentType },
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Error confirmation rental:', error);
          return throwError(() => new Error('Rental confirmation failed.'));
        })
      );
  }
}
