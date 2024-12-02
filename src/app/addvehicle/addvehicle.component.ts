import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { VehicleService } from '../aservice/vehicle.service';
import { AuthService } from '../aservice/auth.service';

@Component({
  selector: 'app-addvehicle',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './addvehicle.component.html',
  styleUrls: ['./addvehicle.component.css'],
})
export class AddvehicleComponent {
  VehicleType: string = '';
  NumberOfVehicle: number = 1;
  Brand: string = '';
  Model: string = '';
  Photo: File | null = null;

  // Status and price fields
  AvailabilityStatus: boolean = true;
  HourlyRate: number | null = null;
  HalfDayRate: number | null = null;
  FullDayRate: number | null = null;

  showSuccessMessage: boolean = false; // Control the success message display

  constructor(
    private http: HttpClient,
    private vehicleservice: VehicleService,
    private authservice: AuthService
  ) {}

  getVehicleTypeValue(): string {
    switch (this.VehicleType) {
      case 'car':
        return '2';
      case 'scooter':
        return '1';
      case 'bicycle':
        return '0';
      default:
        return '0';
    }
  }

  getAvailabilityStatusValue(): boolean {
    return this.AvailabilityStatus;
  }

  onVehicleChange() {
    console.log(`Vehicle Type: ${this.VehicleType}`);
  }

  @Output() close = new EventEmitter<void>();

  closePopup(): void {
    this.close.emit();
  }

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      this.Photo = inputElement.files[0];
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    const formData = new FormData();
    const vehicleTypeValue = this.getVehicleTypeValue();
    const availabilityStatusValue = this.getAvailabilityStatusValue();
    const Token = this.authservice.getToken();
    let businessId: Blob;

    if (!Token) {
      throw new Error('User is not authenticated.');
    } else {
      const decoded = this.authservice.decodeToken();
      businessId = decoded.businessId;
    }

    formData.append('VehicleType', vehicleTypeValue);
    formData.append('Brand', this.Brand);
    formData.append('Model', this.Model);
    formData.append('NumberOfVehicle', this.NumberOfVehicle.toString());

    formData.append('HourlyRate', this.HourlyRate ? this.HourlyRate.toString() : '0');
    formData.append('HalfDayRate', this.HalfDayRate ? this.HalfDayRate.toString() : '0');
    formData.append('FullDayRate', this.FullDayRate ? this.FullDayRate.toString() : '0');

    formData.append('AvailabilityStatus', availabilityStatusValue.toString());

    if (this.Photo) {
      formData.append('Photo', this.Photo);
    }

    if (businessId != null) {
      formData.append('BusinessID', businessId);
    }

    this.vehicleservice.addVehicle(formData).subscribe({
      next: (response) => {
        console.log('Vehicle added successfully', response);
        this.showSuccessMessage = true; // Show success message
        setTimeout(() => {
          this.showSuccessMessage = false; // Hide success message after 3 seconds
          this.closePopup(); // Close the popup
        }, 3000);
      },
      error: (error) => {
        console.error('Failed to add vehicle', error);
      },
    });
  }
}
