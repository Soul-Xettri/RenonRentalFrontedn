import { Component, Inject, PLATFORM_ID, AfterViewInit, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-pokhara-map',
  templateUrl: './pokhara-map.component.html',
  styleUrls: ['./pokhara-map.component.css'],
})
export class PokharaMapComponent implements AfterViewInit {
  private map: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private async initMap(): Promise<void> {
    if (this.map) {
      return; // Map is already initialized
    }

    // Dynamically import Leaflet only if running in the browser
    if (isPlatformBrowser(this.platformId)) {
      const L = (await import('leaflet')).default;

      this.map = L.map('map', {
        center: [28.2096, 83.9856], // Latitude and Longitude for Pokhara
        zoom: 13
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (this.map) {
      this.map.invalidateSize(); // Ensure the map resizes correctly
    }
  }
}
