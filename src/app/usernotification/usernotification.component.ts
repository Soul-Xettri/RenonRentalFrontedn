import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../aservice/auth.service';
import { PaymentService } from '../aservice/payment.service';
declare var bootstrap: any;

interface BookingRequest {
  id: number; // Add if available in your data
  message: string;
  businessName: string;
  userName: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  misc: {
    user: {
      id: number;
      name: string;
    };
    business: {
      id: number;
      name: string;
    };
    vehicle: {
      id: number;
      name: string;
    };
    rentalId: number;
  };
  notificationType: number;
  isRead: boolean;
  createdDate: Date;
}

interface UnReadNotifications {
  unreadCount: number;
}
@Component({
  selector: 'app-usernotification',
  standalone: true,
  imports: [RouterOutlet, NgFor, CommonModule, FormsModule],
  templateUrl: './usernotification.component.html',
  styleUrl: './usernotification.component.css',
})
export class UsernotificationComponent {
  bookingRequests: BookingRequest[] = [];
  unReadNotifications: UnReadNotifications = { unreadCount: 0 };
  unreadNotifications: number = 0;
  currentAction: 'pay' | 'cancel' = 'pay';
  selectedRequest: BookingRequest | null = null;
  private modalInstance: any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      debugger;
      if (params['pidx']) {
        const callBack = {
          pidx: params['pidx'],
        };
        window.open(`https://test-pay.khalti.com/?pidx=${params['pidx']}`);
      }
    });
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.authService.getUserNotifications(userId).subscribe(
      (bookingRequests: BookingRequest[]) => {
        this.bookingRequests = bookingRequests;
        const paymentNotificationIds = this.bookingRequests
          .filter(
            (request) =>
              request.notificationType === 4 || request.notificationType === 3
          )
          .map((request) => request.id);

        paymentNotificationIds.forEach((notificationId) => {
          this.authService.markNotificationAsRead(notificationId).subscribe({
            next: () => {
              console.log(`Notification ${notificationId} marked as read`);
            },
            error: (error) => {
              console.error(
                `Error marking notification ${notificationId} as read:`,
                error
              );
            },
          });
        });
      },
      (error) => {
        console.error('Error fetching booking requests:', error);
      }
    );
    this.authService.markNotificationAsChangeIsNew(userId).subscribe(
      () => {
        this.updateNotificationCount();
      },
      (error) => {
        console.error('Error setting notification as new:', error);
      }
    );
  }

  getTimeDifference(createdDate: Date): string {
    const currentDate = new Date();
    const diffInMilliseconds =
      currentDate.getTime() - new Date(createdDate).getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
  }

  private updateNotificationCount(): void {
    const businessId = this.authService.getBusinessId();
    if (businessId) {
      this.authService.fetchUnReadNotificationsCount(businessId).subscribe({
        next: (response: UnReadNotifications) => {
          this.unreadNotifications = response.unreadCount;
        },
      });
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  stars = Array(5).fill(0); // Create an array for 5 stars
  rating = 0; // The currently selected rating
  hoverRatingValue = 0; // To track hover effect
  review = ''; // The review text

  setRating(value: number): void {
    this.rating = value; // Set the selected rating
  }

  hoverRating(value: number): void {
    this.hoverRatingValue = value; // Adjust stars on hover
    this.rating = this.hoverRatingValue || this.rating; // Keep current rating when hover ends
  }

  submitReview(): void {
    console.log('Rating:', this.rating);
    console.log('Review:', this.review);
    // Add logic to send data to the backend
  }

  initiatePayment() {
    const paymentDetails = {
      returnUrl: 'http://localhost:4200/',
      websiteUrl: 'https://example.com/',
      amount: '7000',
      purchaseOrderId: 'Order01',
      purchaseOrderName: 'Vehicle Rental Order',
      customerName: 'Ram Bahadur',
      customerEmail: 'test@khalti.com',
      customerPhone: '9800000003',
    };
    this.paymentService
      .initiatePaymentApi(paymentDetails)
      .subscribe((res: any) => {
        debugger;
        if (res) {
          if (res.payment_url) {
            window.open(res.payment_url, '_blank'); // Open the payment URL
          }
        }
      });
  }

  showConfirmation(request: BookingRequest, action: 'pay' | 'cancel'): void {
    this.selectedRequest = request;
    this.currentAction = action;
    this.authService.markNotificationAsRead(request.id).subscribe({
      next: () => {
        console.log('Notification marked as read');
      },
      error: (error) => {
        console.error('Error marking notification as read');
      },
    });

    const modalEl = document.getElementById('confirmationModal');
    if (modalEl) {
      this.modalInstance = new bootstrap.Modal(modalEl);
      this.modalInstance.show();
    }
  }

  confirmAction(): void {
    if (!this.selectedRequest) return;

    if (this.currentAction === 'pay') {
      this.acceptRequest(this.selectedRequest);
    } else {
      this.rejectRequest(this.selectedRequest);
    }

    // Close modal
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  private acceptRequest(request: BookingRequest): void {
    this.initiatePayment();
  }

  private rejectRequest(request: BookingRequest): void {
    console.log("request.misc.rentalId",request.misc.rentalId)
    this.authService.cancelRental(request.misc.rentalId).subscribe({
      next: () => {
        this.bookingRequests = this.bookingRequests.filter(
          (r) => r.id !== request.id
        );
        this.updateNotificationCount(); // Update count after action
        alert('Booking request cancelled successfully!');
      },
      error: (error) => {
        console.error('Error rejecting booking request:', error);
        alert('Failed to cancel booking request');
      },
    });
  }
}
