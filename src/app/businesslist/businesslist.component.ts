import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../aservice/vehicle.service';
import { CommonModule } from '@angular/common';
import { SearchDataService } from '../aservice/searchData.spec';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService } from '../aservice/business.service';

interface Vehicle {
  businessId: number;
  businessName: string;
  distance: string;
  rating: number;
  description: string;
  email: string;
  phoneNumber: number;
  imgUrl: string;
  thresholdPrice: number;
  price1: number;
}

@Component({
  selector: 'app-businesslist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './businesslist.component.html',
  styleUrls: ['./businesslist.component.css'],
})
export class BusinesslistComponent implements OnInit {
  vehicles: Vehicle[] = [];
  searchData: any = null; // Add a property to hold search data

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute,
    private searchDataService: SearchDataService,
    private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    // First check URL parameters
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length > 0) {
        // If URL has parameters, use them
        const searchData = {
          vehicleType: parseInt(params['vehicleType']),
          currentAddress: params['currentAddress'],
          latitude: parseFloat(params['latitude']),
          longitude: parseFloat(params['longitude']),
          destinationAddress: params['destinationAddress'],
          startDateTime: params['startDateTime'],
          endDateTime: params['endDateTime']
        };
        
        // Update the service with URL params
        this.searchDataService.updateSearchData(searchData);
        this.fetchVehicles(searchData);
      } else {
        // If no URL params, use the service data
        this.searchDataService.searchData$.subscribe((data) => {
          if (data) {
            this.fetchVehicles(data);
          }
        });
      }
    });
  }

  private fetchVehicles(searchData: any) {
    this.searchData = searchData;
    this.vehicleService.searchVehicles(searchData).subscribe(
      (response: any) => {
        this.vehicles = response;
      },
      (error) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  }

  showModal = false;
  // showPaymentModal = false;
  selectedVehicle?: Vehicle;

  paymentMethod: string = '';

  viewMore(vehicle: Vehicle): void {
    this.businessService.setBusinessId(vehicle.businessId);
    // Navigate with both businessId as route param and preserve search params
    this.router.navigate(['/businessdetail', vehicle.businessId], {
      queryParamsHandling: 'preserve'
    });
  }

  closeModal(): void {
    this.showModal = false;
  }
}
