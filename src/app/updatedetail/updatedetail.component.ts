import { Component } from '@angular/core';

@Component({
  selector: 'app-updatedetail',
  standalone: true,
  imports: [],
  templateUrl: './updatedetail.component.html',
  styleUrl: './updatedetail.component.css'
})
export class UpdatedetailComponent {
  profilePhoto: string = 'https://via.placeholder.com/150'; // Default placeholder photo

  // Handle photo change
  changePhoto(event: any) {
    const file = event.target.files[0]; // Get the uploaded file
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePhoto = reader.result as string; // Set the new photo
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle photo removal
  removePhoto() {
    this.profilePhoto = 'https://via.placeholder.com/150'; // Reset to placeholder
  }

  

}
