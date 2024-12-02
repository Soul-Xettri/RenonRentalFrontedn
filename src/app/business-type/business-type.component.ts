import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-business-type',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './business-type.component.html',
  styleUrl: './business-type.component.css'
})
export class BusinessTypeComponent {

}
