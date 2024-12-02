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
    rental: {
      id: number;
    };
  };
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
      },
      (error) => {
        console.error('Error fetching booking requests:', error);
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

  showConfirmation(request: BookingRequest, action: 'accept' | 'reject'): void {
    this.selectedRequest = request;
    this.currentAction = action;

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
    this.businessService.acceptRental(request.misc.rental.id).subscribe({
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
    this.businessService.rejectRental(request.misc.rental.id).subscribe({
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
