import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BusinessService } from '../aservice/business.service';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../aservice/vehicle.service';
import { AuthService } from '../aservice/auth.service';
interface Vehicle {
  id: number;
  brand: string;
  model: string;
  availabilityStatus: boolean;
  hourlyRate: number;
  halfDayRate: number;
  fullDayRate: number;
  photo: {
    fileName: string;
    contentType: string;
    fileContent: string;
  };
  photoUrl?: string; // Added for displaying image
}

interface BusinessDetails {
  id: number;
  businessName: string;
  address: string;
  contactNumber: string;
  averageRating: number;
  availableVehicles: Vehicle[];
  reviews: any[];
}

@Component({
  selector: 'app-getbusinessdetail',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './getbusinessdetail.component.html',
  styleUrls: ['./getbusinessdetail.component.css'],
})
export class GetbusinessdetailComponent implements OnInit {
  vehicles: Vehicle[] = [];
  selectedVehicle?: Vehicle;
  businessDetails?: BusinessDetails;
  searchParams: any;

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get business ID from route params
    this.route.params.subscribe((params) => {
      const businessId = parseInt(params['businessId']);
      if (businessId) {
        this.businessService.setBusinessId(businessId);
        this.fetchBusinessDetails(businessId);
      }
    });

    // Get search parameters from query params
    this.route.queryParams.subscribe((params) => {
      this.searchParams = {
        startDateTime: params['startDateTime'],
        endDateTime: params['endDateTime'],
      };
    });
  }

  private fetchBusinessDetails(businessId: number): void {
    let vehicleType: number = 0; // Default value or assign based on your logic
    this.route.queryParamMap.subscribe((params) => {
      vehicleType = parseInt(params.get('vehicleType') || '0', 10);
    });
    this.businessService.getBusinessDetails(businessId, vehicleType).subscribe({
      next: (response: BusinessDetails) => {
        this.businessDetails = response;
        this.vehicles = response.availableVehicles.map((vehicle) => ({
          ...vehicle,
          photoUrl: `data:${vehicle.photo.contentType};base64,${vehicle.photo.fileContent}`,
        }));
      },
      error: (error) => {
        console.error('Error fetching business details:', error);
      },
    });
  }

  selectVehicle(vehicle: Vehicle): void {
    // Deselect if clicking the same vehicle
    if (this.selectedVehicle === vehicle) {
      this.selectedVehicle = undefined;
    } else {
      this.selectedVehicle = vehicle;
    }
  }

  bookNow(vehicle: Vehicle): void {
    if (!vehicle.id) {
      console.error('Vehicle ID is missing');
      alert('Error: Vehicle ID is missing');
      return;
    }

    if (!vehicle.availabilityStatus) {
      alert('This vehicle is not available');
      return;
    }

    const bookingDetails = `
      Vehicle ID: ${vehicle.id}
      Vehicle: ${vehicle.brand} ${vehicle.model}
      Start Time: ${new Date(this.searchParams.startDateTime).toLocaleString()}
      End Time: ${new Date(this.searchParams.endDateTime).toLocaleString()}
    `;

    if (confirm(`Confirm booking?\n\n${bookingDetails}`)) {
      const userId = this.authService.getUserId();
      const bookingData = {
        userId: userId,
        vehicleId: vehicle.id,
        startDateTime: this.searchParams.startDateTime,
        endDateTime: this.searchParams.endDateTime,
      };

      this.vehicleService.bookVehicle(bookingData).subscribe({
        next: (response) => {
          alert('Booking successful!');
          this.selectedVehicle = undefined;
          this.fetchBusinessDetails(this.businessService.getBusinessId()!);
        },
        error: (error) => {
          alert('Booking failed: ' + error.message);
        },
      });
    }
  }
}
