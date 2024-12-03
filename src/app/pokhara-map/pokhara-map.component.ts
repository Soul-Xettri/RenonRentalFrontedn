// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-pokhara-map',
//   standalone: true,
//   imports: [],
//   templateUrl: './pokhara-map.component.html',
//   styleUrl: './pokhara-map.component.css'
// })
// export class PokharaMapComponent {

// }

import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-pokhara-map',
  standalone: true,
  imports: [GoogleMapsModule,],
  templateUrl: './pokhara-map.component.html',
  styleUrls: ['./pokhara-map.component.css']
})
export class PokharaMapComponent {
  center: google.maps.LatLngLiteral = { lat: 28.2096, lng: 83.9856 }; // Pokhara coordinates
  zoom = 13;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap', // You can change this to 'satellite' if you prefer
    disableDefaultUI: true,
    zoomControl: true,
  };
}
