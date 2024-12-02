import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mode',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './mode.component.html',
  styleUrl: './mode.component.css'
})
export class ModeComponent {

}
