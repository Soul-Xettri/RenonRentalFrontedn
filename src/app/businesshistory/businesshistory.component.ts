import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../aservice/auth.service';
import { BusinessService } from '../aservice/business.service';
interface Booking {
  User: string;
  model: string;
  brand: string;
  startDate: string;
  endDate: string;
  rentalStatus: string;
  VehicleId: string;
  totalPrice: number;
  CreatedDate: string;
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
  selector: 'app-businesshistory',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './businesshistory.component.html',
  styleUrl: './businesshistory.component.css',
})
export class BusinesshistoryComponent {
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
    this.businessService.fetchUnReadNotificationsCount(businessId).subscribe({
      next: (response: UnReadNotifications) => {
        this.unreadNotifications = response.unreadCount;
        console.log('Unread notifications:', this.unreadNotifications);
      },
      error: (error) => {
        console.error('Error fetching unread count:', error);
      },
    });
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
          this.bookings = bookings
            .filter((booking) => booking.rentalStatus === 'Confirmed' || booking.rentalStatus === 'Completed') // Add this line
            .map((booking) => ({
              ...booking,
              photoUrl: `data:${booking.photo.contentType};base64,${booking.photo.fileContent}`,
              startDate: new Date(booking.startDate).toLocaleDateString(),
              endDate: new Date(booking.endDate).toLocaleDateString(),
            }));
        },
        (error) => {
          console.error('Error fetching bookings:', error);
        }
      );
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
