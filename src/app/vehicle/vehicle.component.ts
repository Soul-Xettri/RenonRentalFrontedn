export interface Vehicle {
  id: number;
  name: string;
  photo: string;
  totalQuantity: number;
  availabilityStatus: boolean;
  brand?: string; // Add brand
  model?: string; // Add model
  hourlyRate?: number; // Add hourly rate
  halfDayRate?: number; // Add half-day rate
  fullDayRate?: number; // Add full-day rate
}
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AddvehicleComponent } from '../addvehicle/addvehicle.component';
import { ViewdetailpopupComponent } from '../viewdetailpopup/viewdetailpopup.component';
import { UpdatedeleteComponent } from '../updatedelete/updatedelete.component';
import { HttpClient } from '@angular/common/http';
import { VehicleService } from '../aservice/vehicle.service';
import { LoginstateService } from '../aservice/loginstate.service';
import { AuthService } from '../aservice/auth.service';
import { BusinessService } from '../aservice/business.service';
// import { AddvehicleComponent } from "../addvehicle/addvehicle.component";
declare var bootstrap: any;

interface UnReadNotifications {
  unreadCount: number;
}
@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    AddvehicleComponent,
    ViewdetailpopupComponent,
    UpdatedeleteComponent,
  ],
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css'],
})
export class VehicleComponent {
  // selectedVehicle: any = null;
  // showPopup: boolean = false;

  vehicles = {
    cars: [] as any[],
    bikes: [] as any[],
    bicycles: [] as any[],
  };
  // Inject HttpClient in the constructor for making HTTP requests
  constructor(
    private http: HttpClient,
    private vehicleservice: VehicleService,
    private loginStateService: LoginstateService,
    private router: Router,
    private authService: AuthService,
    private businessService: BusinessService
  ) {}

  unReadNotifications: UnReadNotifications = { unreadCount: 0 };
  unreadNotifications: number = 0;

  // Lifecycle hook
  ngOnInit(): void {
    const businessId = this.authService.getBusinessId();
    this.businessService.fetchUnReadNotificationsCount(businessId).subscribe({
      next: (response: UnReadNotifications) => {
        this.unreadNotifications = response.unreadCount;
        console.log('Unread notifications:', this.unreadNotifications);
      },
      error: (error) => {
        console.error('Error fetching unread count:', error);
      },
    });
    const token = this.authService.getToken();
    if (token) {
      const decoded = this.authService.decodeToken();
      this.fetchAllVehicleTypes(decoded.businessId);
    }
  }

  // Method to fetch vehicles from backend and categorize them by type
  fetchAllVehicleTypes(businessId: number): void {
    // Fetch cars (vehicleType = 2)
    this.vehicleservice.getVehicleDetails(businessId, 2).subscribe(
      (response: any) => {
        response.forEach((vehicle: any) => {
          if (vehicle.photo && vehicle.photo.fileContent) {
            vehicle.photoUrl = `data:${vehicle.photo.contentType};base64,${vehicle.photo.fileContent}`;
          }
        });
        this.vehicles.cars = response;
      },
      (error) => {
        console.error('Failed to fetch cars', error);
      }
    );

    // Fetch bikes (vehicleType = 1)
    this.vehicleservice.getVehicleDetails(businessId, 1).subscribe(
      (response: any) => {
        response.forEach((vehicle: any) => {
          if (vehicle.photo && vehicle.photo.fileContent) {
            vehicle.photoUrl = `data:${vehicle.photo.contentType};base64,${vehicle.photo.fileContent}`;
          }
        });
        this.vehicles.bikes = response;
      },
      (error) => {
        console.error('Failed to fetch bikes', error);
      }
    );

    // Fetch bicycle (vehicleType = 0)
    this.vehicleservice.getVehicleDetails(businessId, 0).subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          response.forEach((vehicle: any) => {
            if (vehicle.photo && vehicle.photo.fileContent) {
              vehicle.photoUrl = `data:${vehicle.photo.contentType};base64,${vehicle.photo.fileContent}`;
            }
          });
          this.vehicles.bicycles = response;
        } else {
          console.error('Unexpected response format for cars:', response);
        }
      },
      (error) => {
        console.error('Failed to fetch cars', error);
      }
    );
  }

  VehicleType: string = '';
  getVehicleTypeValue(): string {
    switch (this.VehicleType) {
      case 'car':
        return '2';
      case 'bike':
        return '1';
      case 'bicycle':
        return '0';
      default:
        return '0'; // Default to 'car' if no match found
    }
  }
  NumberOfVehicle: number = 1;
  Brand: string = '';
  Model: string = '';
  Photo: File | null = null;

  // Status and price fields
  AvailabilityStatus: boolean = true;
  getAvailabilityStatusValue(): boolean {
    return this.AvailabilityStatus;
  }
  HourlyRate: number | null = null; // Hourly rate
  HalfDayRate: number | null = null; // Half-day rate
  FullDayRate: number | null = null; // Full-day rate

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  onVehicleChange() {
    console.log(`Vehicle Type: ${this.VehicleType}`);
  }

  @Output() close = new EventEmitter<void>();

  // Method to handle file input change for the vehicle's photo
  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      this.Photo = inputElement.files[0];
    }
  }

  // Method to submit the vehicle data to the backend
  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData();

    // Convert vehicle type and availability status to numeric values
    const vehicleTypeValue = this.getVehicleTypeValue();
    const availabilityStatusValue = this.getAvailabilityStatusValue();
    const businessId = this.loginStateService.getBusinessId();

    // Append vehicle details to the form data
    formData.append('VehicleType', vehicleTypeValue);
    formData.append('Brand', this.Brand);
    formData.append('Model', this.Model);
    formData.append('NumberOfVehicle', this.NumberOfVehicle.toString());

    // Append prices for all three periods
    formData.append(
      'HourlyRate',
      this.HourlyRate ? this.HourlyRate.toString() : '0'
    );
    formData.append(
      'HalfDayRate',
      this.HalfDayRate ? this.HalfDayRate.toString() : '0'
    );
    formData.append(
      'FullDayRate',
      this.FullDayRate ? this.FullDayRate.toString() : '0'
    );

    // Append availability status
    formData.append('AvailabilityStatus', availabilityStatusValue.toString());

    // Append the business registration file if available
    if (this.Photo) {
      formData.append('Photo', this.Photo);
    }

    if (businessId != null) {
      formData.append('BusinessID', businessId);
    }

    // Send the POST request to the backend API
    this.vehicleservice.addVehicle(formData).subscribe({
      next: (response) => {
        console.log('Vehicle added successfully', response);
        this.closePopup(); // Close the popup on success
      },
      error: (error) => {
        console.error('Failed to add vehicle', error);
      },
    });
  }

  openPopup(): void {
    this.showPopup = true;
  }

  selectedVehicle: Vehicle | null = null; // Track selected vehicle
  showPopup: boolean = false; // Track if the popup is visible

  // To view details and open the popup modal
  viewMore(vehicle: Vehicle) {
    this.selectedVehicle = vehicle; // Set selected vehicle
    this.showPopup = true; // Open the popup
  }

  // To close the popup modal
  closePopup(): void {
    this.selectedVehicle = null; // Reset selected vehicle
    this.showPopup = false; // Close the popup
  }

  // State for Add Inventory Popup
  showAddInventoryPopup: boolean = false;

  // Function to open the Add Inventory Popup
  openAddInventoryPopup(): void {
    this.showAddInventoryPopup = true;
    // Close vehicle details popup if open
  }
  // Function to close the Add Inventory Popup
  closeAddInventoryPopup(): void {
    this.showAddInventoryPopup = false;
  }
  // Holds the currently selected vehicle
  showModal: boolean = false; // Controls the visibility of the modal

  openUpdateDeleteModal(vehicle: any) {
    this.selectedVehicle = vehicle; // Pass the vehicle data to the child component
    this.showModal = true; // Open the modal
  }

  onUpdate(carId: number) {
    console.log('Update clicked for car with ID:', carId);
    // Add logic to open update modal or navigate to update page
  }

  onDelete(carId: number) {
    console.log('Delete clicked for car with ID:', carId);
    // Add logic to confirm deletion or open delete modal
  }

  // update delete

  selectedCar: any = {};
  isUpdateMode: boolean = true;

  private modalInstance: any;

  openUpdateModal(car: any) {
    console.log('Selected car:', car);
    this.selectedCar = { ...car };
    this.isUpdateMode = true;
    const modalElement = document.getElementById('vehicleActionModal');
    this.modalInstance = new bootstrap.Modal(modalElement!);
    this.modalInstance.show();
  }

  openDeleteModal(carId: number) {
    this.selectedCar = { id: carId };
    this.isUpdateMode = false;
    const modalElement = document.getElementById('vehicleActionModal');
    this.modalInstance = new bootstrap.Modal(modalElement!);
    this.modalInstance.show();
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.modalInstance = null;
    }
    this.showModal = false;
    const token = this.authService.getToken();
    if (token) {
      const decoded = this.authService.decodeToken();
      this.fetchAllVehicleTypes(decoded.businessId); // Refresh the data
    }
  }

  handleUpdate(updatedCar: any) {
    const id = this.selectedCar.id;
    const vehicleType = this.selectedCar.vehicleType;
    this.vehicleservice
      .updateVehicleDetails(id, vehicleType, updatedCar)
      .subscribe({
        next: () => {
          this.closeModal();
        },
        error: (error) => {
          console.error('Failed to update vehicle:', error);
        },
      });
  }

  handleDelete(carId: number) {
    this.vehicleservice.deleteVehicle(carId).subscribe({
      next: () => {
        this.closeModal();
      },
      error: (error) => {
        console.error('Failed to delete vehicle:', error);
      },
    });
  }
}
