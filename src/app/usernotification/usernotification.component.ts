import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../aservice/auth.service';

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
    rental: {
      id: number;
    };
  };
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

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.authService.getUserNotifications(userId).subscribe(
      (bookingRequests: BookingRequest[]) => {
        this.bookingRequests = bookingRequests;
      },
      (error) => {
        console.error('Error fetching booking requests:', error);
      }
    );
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
}
