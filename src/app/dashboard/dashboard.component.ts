import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { AddvehicleComponent } from '../addvehicle/addvehicle.component';
import { VehicleService } from '../aservice/vehicle.service';
import { AuthService } from '../aservice/auth.service';
import { BusinessService } from '../aservice/business.service';
// import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';

interface UnReadNotifications {
  unreadCount: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    AddvehicleComponent,
    RouterOutlet,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalVehicles: number = 0;
  unReadNotifications: UnReadNotifications = { unreadCount: 0 };
  unreadNotifications: number = 0;
  totalAvailableVehicles: number = 0;
  vehicleTypeSummaries: any[] = [];
  labels: string[] = []; // Labels for chart (Vehicle Types)
  barChartData: number[] = []; // Data for pie chart (Available Vehicles)
  pieChartData: number[] = []; // Data for bar chart (Total Vehicles)

  isSidebarOpen: boolean = true; // Initially, the sidebar is open

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  constructor(
    private vehicleservice: VehicleService,
    private router: Router,
    private authService: AuthService,
    private businessService: BusinessService
  ) {}

  ngOnInit() {
    const decoded = this.authService.decodeToken();
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
    this.fetchDashboardData(decoded.businessId);
  }

  fetchDashboardData(businessId: number) {
    this.vehicleservice.getBusinessDashboard(businessId).subscribe(
      (data) => {
        this.totalVehicles = data.totalVehicles;
        this.totalAvailableVehicles = data.totalAvailableVehicles;
        this.vehicleTypeSummaries = data.vehicleTypeSummaries;

        // Prepare chart data
        this.labels = this.vehicleTypeSummaries.map((v: any) => v.vehicleType);
        this.barChartData = this.vehicleTypeSummaries.map(
          (v: any) => v.totalQuantity
        );
        this.pieChartData = this.vehicleTypeSummaries.map(
          (v: any) => v.availableQuantity
        );

        this.renderPieChart();
        this.renderBarChart();
      },
      (error) => {
        console.error('Error fetching dashboard data:', error);
      }
    );
  }

  renderPieChart() {
    const chartElement = document.getElementById(
      'rentalTrendsChart'
    ) as HTMLCanvasElement;
    if (chartElement) {
      new Chart(chartElement, {
        type: 'pie',
        data: {
          // labels: ['car', 'Scooter/Bike', 'Bicycle', ],
          labels: this.labels,
          datasets: [
            {
              // label: 'Rentals',
              // data: [50, 75, 100],
              data: this.pieChartData,
              backgroundColor: ['#007bff', '#28a745', '#ffc107'],
            },
          ],
        },
        options: {
          animation: {
            duration: 6000, // Slower animation (2 seconds)
          },
        },
      });
    }
  }

  renderBarChart() {
    const chartElement = document.getElementById(
      'vehicleUtilizationChart'
    ) as HTMLCanvasElement;
    if (chartElement) {
      new Chart(chartElement, {
        type: 'bar',
        data: {
          // labels: ['Car', 'Scooter/Bike', 'Bicycle'],
          labels: this.labels,
          datasets: [
            {
              // label: '',
              // data: [80, 70, 60],
              data: this.barChartData,
              backgroundColor: ['#007bff', '#28a745', '#dc3545'],
            },
          ],
        },
        options: {
          animation: {
            duration: 6000, // Slower animation (2 seconds)
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
            },
          },
        },
      });
    }
  }

  showPopup = false;

  openPopup(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  //add vehicle pop up
  selectedVehicle: string = 'bicycle'; // Default selection (Bicycle)
  quantity: number = 1;
  brandName: string = '';
  model: string = '';
  businessRegistration: File | null = null;

  onVehicleChange() {
    // Handle any additional logic when vehicle type is changed, if needed.
    console.log(`Selected vehicle: ${this.selectedVehicle}`);
  }
  isModalVisible = false; // Track modal visibility

  showModal() {
    this.isModalVisible = true; // Show the modal
  }

  closeModal() {
    this.isModalVisible = false; // Hide the modal
  }

  // Handle form submission
  submitForm() {
    console.log('Form Submitted!');
    console.log('Vehicle Type:', this.selectedVehicle);
    console.log('Quantity:', this.quantity);
    if (this.brandName) console.log('Brand Name:', this.brandName);
    if (this.model) console.log('Model:', this.model);

    // Perform additional form processing (e.g., API call)

    // Close the modal and return to the dashboard
    this.closeModal();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
