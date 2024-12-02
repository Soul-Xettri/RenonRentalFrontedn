import { CommonModule } from '@angular/common';
import { Component,Input,  Output, EventEmitter } from '@angular/core';
import { Vehicle, VehicleComponent } from '../vehicle/vehicle.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-viewdetailpopup',
  standalone: true,
  imports: [CommonModule,FormsModule,VehicleComponent],
  templateUrl: './viewdetailpopup.component.html',
  styleUrl: './viewdetailpopup.component.css'
})
export class ViewdetailpopupComponent {

  @Input() vehicle: Vehicle | null = null;  // Input to receive selected vehicle data
  @Input() showPopup: boolean = false;  // Input to control popup visibility
  @Output() close = new EventEmitter<void>();  // Event emitter to notify parent to close the popup

  closePopup() {
    this.close.emit();  // Emit event to close the popup
  }
}
