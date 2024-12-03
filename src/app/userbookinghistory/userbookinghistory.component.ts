import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../aservice/auth.service';

interface Booking {
  businessName: string;
  model: string;
  brand: string;
  startDate: string;
  endDate: string;
  vehicleId: string;
  totalPrice: number;
  createdDate: string;
  photo: {
    fileName: string;
    contentType: string;
    fileContent: string;
  };
  photoUrl: string;
}

@Component({
  selector: 'app-userbookinghistory',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './userbookinghistory.component.html',
  styleUrl: './userbookinghistory.component.css',
})
export class UserbookinghistoryComponent {
  bookings: Booking[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.authService.getBookingHistory(userId).subscribe(
        (bookings: Booking[]) => {
          this.bookings = bookings.map((booking) => ({
            ...booking,
            photoUrl: `data:${booking.photo.contentType};base64,${booking.photo.fileContent}`,
          }));
          console.log('Processed bookings:', this.bookings);
        },
        (error) => {
          console.error('Error fetching bookings:', error);
        }
      );
    }
  }
}
