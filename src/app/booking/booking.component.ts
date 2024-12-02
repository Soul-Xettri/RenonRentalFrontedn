import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../aservice/auth.service';
import { BusinessService } from '../aservice/business.service';
export interface Booking {
  id: number; // Add this property
  userName: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  rentalStatus: string;
  photo: {
    fileName: string;
    contentType: string;
    fileContent: string;
  };
  photoUrl?: string;
}

interface UnReadNotifications {
  unreadCount: number;
}
@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent {
  selectedColor: string = '#28a745'; // Green for Confirmed
  selectedTextColor: string = 'white'; // White text
  unReadNotifications: UnReadNotifications = { unreadCount: 0 };
  unreadNotifications: number = 0;
  bookings: Booking[] = [];

  constructor(
    private authService: AuthService,
    private businessService: BusinessService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const businessId = this.authService.getBusinessId();
    if (businessId) {
      this.businessService.fetchUnReadNotificationsCount(businessId).subscribe({
        next: (response: UnReadNotifications) => {
          this.unreadNotifications = response.unreadCount;
          console.log('Unread notifications:', this.unreadNotifications);
        },
        error: (error) => {
          console.error('Error fetching unread count:', error);
        },
      });
      this.businessService.getBusinessBookings(businessId).subscribe(
        (bookings: Booking[]) => {
          this.bookings = bookings.map((booking) => ({
            ...booking,
            photoUrl: `data:${booking.photo.contentType};base64,${booking.photo.fileContent}`,
          }));
        },
        (error) => {
          console.error('Error fetching bookings:', error);
        }
      );
    }
  }

  // Function to handle accepting a booking
  acceptBooking(bookingId: number) {
    this.businessService.acceptRental(bookingId).subscribe(
      (response) => {
        // Update the booking status in the UI
        const booking = this.bookings.find((b) => b.id === bookingId);
        if (booking) {
          booking.rentalStatus = 'Accepted';
        }
      },
      (error) => {
        console.error('Error accepting booking:', error);
      }
    );
  }

  markAsCompleted(bookingId: number): void {
    // Business user marks the booking as 'Completed'
    console.log(`Booking ID ${bookingId} marked as Completed`);

    // Optionally, make an API call to update the status on the server
    // this.bookingService.updateStatus(bookingId, newStatus).subscribe();
  }
  markAsRejected(bookingId: number) {
    this.businessService.rejectRental(bookingId).subscribe(
      (response) => {
        console.log('Booking rejected:', response);
        // Update the booking status in the UI
        const booking = this.bookings.find((b) => b.id === bookingId);
        if (booking) {
          booking.rentalStatus = 'Rejected';
        }
      },
      (error) => {
        console.error('Error rejecting booking:', error);
      }
    );
  }
  onStatusChange(booking: any) {
    console.log('Status changed to:', booking.rentalStatus);
    if (booking.rentalStatus === 'Completed') {
      this.markAsCompleted(booking.id);
    } else if (booking.rentalStatus === 'Rejected') {
      this.markAsRejected(booking.id);
    } else if (booking.rentalStatus === 'Accepted') {
      this.acceptBooking(booking.id);
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
