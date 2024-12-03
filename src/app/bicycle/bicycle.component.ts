import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-bicycle',
  standalone: true,
  imports: [RouterLink,RouterOutlet],
  templateUrl: './bicycle.component.html',
  styleUrl: './bicycle.component.css'
})
export class BicycleComponent {

}
