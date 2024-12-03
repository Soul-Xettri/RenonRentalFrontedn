import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service'; 
// import { Vehicle } from '../viewdetailpopup/viewdetailpopup.component';  // Import your Vehicle model

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private readonly apiUrl = environment.API_URL; // Base API URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  addVehicle(formData: FormData): Observable<any> {
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
    return this.http
      .post(`${this.apiUrl}/Vehicle/add`, formData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error adding vehicle:', error);
          return throwError(() => new Error('Vehicle registration failed.'));
        })
      );
  }

  getBusinessDashboard(businessId: number): Observable<any> {
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
    return this.http
      .get(`${this.apiUrl}/VehicleRental/business-dashboard/${businessId}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching business dashboard data:', error);
          return throwError(
            () => new Error('Failed to fetch business dashboard data.')
          );
        })
      );
  }

  getVehicleDetails(businessId: number, vehicleType: number): Observable<any> {
    const numericBusinessId = Number(businessId); // Convert to number if needed
    if (isNaN(numericBusinessId)) {
      console.error('Invalid businessId:', businessId);
      return throwError(() => new Error('Invalid businessId.')); // Handle invalid businessId
    }
    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    // Set headers for the request
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = {
      businessId: numericBusinessId,
      vehicleType,
    };

    return this.http
      .post(`${this.apiUrl}/VehicleRental/vehicle-type-details`, body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching business dashboard data:', error);
          return throwError(
            () => new Error('Failed to fetch business dashboard data.')
          );
        })
      );
  }

  getUserDetails(userId: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    // Create headers and include the Authorization header
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      // No need to set 'Content-Type' for FormData
    });
    return this.http.get(`${this.apiUrl}/Auth/user-details/${userId}`, {
      headers,
    });
  }

  searchVehicles(searchData: any): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .post(`${this.apiUrl}/VehicleRental/search`, searchData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error searching vehicles:', error);
          return throwError(() => new Error('Vehicle search failed.'));
        })
      );
  }

  updateVehicleDetails(
    id: number,
    vehicleType: number,
    updateData: any
  ): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    // Convert availabilityStatus to boolean and wrap the data in a vehicle object
    const body = {
      id: id,
      vehicleType: vehicleType,
      model: updateData.model,
      brand: updateData.brand,
      numberOfVehicle: updateData.totalQuantity,
      rentalCharges: {
        hourlyRate: updateData.hourlyRate,
        halfDayRate: updateData.halfDayRate,
        fullDayRate: updateData.fullDayRate,
      },
      availabilityStatus:
        updateData.availabilityStatus === 'true' ? true : false,
    };


    return this.http
      .put(`${this.apiUrl}/Vehicle/update`, body, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error updating vehicle:', error);
          return throwError(() => new Error('Vehicle update failed.'));
        })
      );
  }

  deleteVehicle(id: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .delete(`${this.apiUrl}/Vehicle/delete/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error deleting vehicle:', error);
          return throwError(() => new Error('Vehicle deletion failed.'));
        })
      );
  }

  bookVehicle(vehicleData: any): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .post(`${this.apiUrl}/VehicleRental/create-rent-vehicle`, vehicleData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error booking vehicle:', error);
          return throwError(() => new Error('Vehicle booking failed.'));
        })
      );
  }
}
