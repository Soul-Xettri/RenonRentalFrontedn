import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { BusinessService } from '../aservice/business.service';
import { AuthService } from '../aservice/auth.service';
declare var bootstrap: any;

interface BookingRequest {
  id: number; // Add if available in your data
  message: string;
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
  selector: 'app-businessnotification',
  standalone: true,
  imports: [RouterOutlet, NgFor, CommonModule],
  templateUrl: './businessnotification.component.html',
  styleUrl: './businessnotification.component.css',
})
export class BusinessnotificationComponent {
  bookingRequests: BookingRequest[] = [];
  unReadNotifications: UnReadNotifications = { unreadCount: 0 };
  currentAction: 'accept' | 'reject' = 'accept';
  selectedRequest: BookingRequest | null = null;
  private modalInstance: any;
  unreadNotifications: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    const businessId = this.authService.getBusinessId();
    // Fetch unread count
    this.businessService.fetchUnReadNotificationsCount(businessId).subscribe({
      next: (response: UnReadNotifications) => {
        this.unreadNotifications = response.unreadCount;
        console.log('Unread notifications:', this.unreadNotifications);
      },
      error: (error) => {
        console.error('Error fetching unread count:', error);
      },
    });
    this.businessService.fetchBusinessNotifications(businessId).subscribe(
      (bookingRequests: BookingRequest[]) => {
        this.bookingRequests = bookingRequests;
        // Mark notifications with notificationType: 4 as read
        const paymentNotificationIds = this.bookingRequests
          .filter((request) => request.notificationType === 4)
          .map((request) => request.id);

        paymentNotificationIds.forEach((notificationId) => {
          this.businessService
            .markNotificationAsRead(notificationId)
            .subscribe({
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
    this.businessService.markNotificationAsChangeIsNew(businessId).subscribe(
      () => {
        this.updateNotificationCount();
      },
      (error) => {
        console.error('Error setting notification as new:', error);
      }
    );
  }
  private updateNotificationCount(): void {
    const businessId = this.authService.getBusinessId();
    if (businessId) {
      this.businessService.fetchUnReadNotificationsCount(businessId).subscribe({
        next: (response: UnReadNotifications) => {
          this.unreadNotifications = response.unreadCount;
        },
      });
    }
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

  showConfirmation(request: BookingRequest, action: 'accept' | 'reject'): void {
    this.selectedRequest = request;
    this.currentAction = action;
    this.businessService.markNotificationAsRead(request.id).subscribe({
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

    if (this.currentAction === 'accept') {
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
    this.businessService.acceptRental(request.misc.rentalId).subscribe({
      next: () => {
        this.bookingRequests = this.bookingRequests.filter(
          (r) => r.id !== request.id
        );
        this.updateNotificationCount(); // Update count after action
        alert('Booking request accepted successfully!');
      },
      error: (error) => {
        console.error('Error accepting booking request:', error);
        alert('Failed to accept booking request');
      },
    });
  }

  private rejectRequest(request: BookingRequest): void {
    this.businessService.rejectRental(request.misc.rentalId).subscribe({
      next: () => {
        this.bookingRequests = this.bookingRequests.filter(
          (r) => r.id !== request.id
        );
        this.updateNotificationCount(); // Update count after action
        alert('Booking request rejected successfully!');
      },
      error: (error) => {
        console.error('Error rejecting booking request:', error);
        alert('Failed to reject booking request');
      },
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
