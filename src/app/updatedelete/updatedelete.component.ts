import { CommonModule } from '@angular/common';
import { Component,Input,Output,EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-updatedelete',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './updatedelete.component.html',
  styleUrl: './updatedelete.component.css'
})
export class UpdatedeleteComponent {
  @Input() vehicle: any; // Vehicle details passed from parent
  @Input() isUpdateMode: boolean = true; // Controls if modal is in update or delete mode
  @Output() onUpdate = new EventEmitter<any>(); // Event emitter for update action
  @Output() onDelete = new EventEmitter<number>(); // Event emitter for delete action

  // Confirm Update
  confirmUpdate() {
    this.onUpdate.emit(this.vehicle); // Emit the updated vehicle details to the parent
  }

  // Confirm Delete
  confirmDelete() {
    this.onDelete.emit(this.vehicle.id); // Emit the vehicle ID to the parent for deletion
  }

}
