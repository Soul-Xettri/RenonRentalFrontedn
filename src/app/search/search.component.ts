import { Component, NgZone, HostListener } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchDataService } from '../aservice/searchData.spec';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    FormsModule,
    HttpClientModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  selectedVehicle: string = '';
  pickupLocation: string = '';
  destinationLocation: string = '';
  pickupFilteredLocations: any[] = [];
  destinationFilteredLocations: any[] = [];
  latitude: number = 0;
  longitude: number = 0;
  pickupDate: string = '2024-12-11';
  pickupTime: string = '12:00';
  destinationDate: string = '2024-12-12';
  destinationTime: string = '12:00';

  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
    private searchDataService: SearchDataService,
    private router: Router
  ) {}

  selectVehicle(vehicle: string): void {
    this.selectedVehicle = vehicle;
  }

  filterLocation(event: Event, type: 'pickup' | 'destination'): void {
    const input = (event.target as HTMLInputElement).value;
    if (input.length > 2) {
      const apiUrl = `https://nominatim.openstreetmap.org/search?q=${input}+pokhara&format=json&addressdetails=1&limit=5`;
      this.http.get(apiUrl).subscribe((response: any) => {
        this.ngZone.run(() => {
          if (type === 'pickup') {
            this.pickupFilteredLocations = response;
          } else if (type === 'destination') {
            this.destinationFilteredLocations = response;
          }
        });
      });
    } else {
      if (type === 'pickup') {
        this.pickupFilteredLocations = [];
      } else if (type === 'destination') {
        this.destinationFilteredLocations = [];
      }
    }
  }

  selectSuggestion(location: any, type: 'pickup' | 'destination'): void {
    if (type === 'pickup') {
      this.pickupLocation = location.display_name;
      this.pickupFilteredLocations = [];
      this.latitude = parseFloat(location.lat);
      this.longitude = parseFloat(location.lon);
    } else if (type === 'destination') {
      this.destinationLocation = location.display_name;
      this.destinationFilteredLocations = [];
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (
      targetElement &&
      !targetElement.closest('.suggestions-list') &&
      targetElement.id !== 'pickup-input' &&
      targetElement.id !== 'destination-input'
    ) {
      this.pickupFilteredLocations = [];
      this.destinationFilteredLocations = [];
    }
  }

  onSubmit(): void {
    const searchData = {
      vehicleType:
        this.selectedVehicle === 'car'
          ? 2
          : this.selectedVehicle === 'bike'
          ? 1
          : 0,
      currentAddress: this.pickupLocation,
      latitude: this.latitude,
      longitude: this.longitude,
      destinationAddress: this.destinationLocation,
      startDateTime: `${this.pickupDate}T${this.pickupTime}:00.000Z`,
      endDateTime: `${this.destinationDate}T${this.destinationTime}:00.000Z`,
    };

    // Update the searchData in the shared service
    this.searchDataService.updateSearchData(searchData);

    // Navigate to businesslist with query params
    this.router.navigate(['/businesslist'], {
      queryParams: {
        vehicleType: searchData.vehicleType,
        currentAddress: searchData.currentAddress,
        latitude: searchData.latitude,
        longitude: searchData.longitude,
        destinationAddress: searchData.destinationAddress,
        startDateTime: searchData.startDateTime,
        endDateTime: searchData.endDateTime,
      },
    });
  }
}
