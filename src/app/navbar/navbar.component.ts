import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { AuthService } from '../aservice/auth.service';
import { HttpClient } from '@angular/common/http';

import { Subscription, throwError } from 'rxjs';
import { LoginstateService } from '../aservice/loginstate.service';
import { VehicleService } from '../aservice/vehicle.service';
import { SignalrService } from '../core-services/signalr.services';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface UnReadNotifications {
  unreadCount: number;
}
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  unReadNotifications: UnReadNotifications = { unreadCount: 0 };
  unreadNotifications: number = 0;
  showProfileModal = false; // Initially hidden
  showEditProfileModal = false; // For edit profile modal
  menuOpen: boolean = false;
  isLoggedIn: boolean = false;
  userProfile: any = null; // User profile data

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  currentUserId:any=null;
  currentBusinessId:any=null;
  currentRole:any=null;
  constructor(
    private loginStateService: LoginstateService,
    private router: Router,
    private authservice: AuthService,
    private vehicleservice: VehicleService,
    private signalRService: SignalrService
  ) {
    if(this.authservice.isLoggedIn()){
      this.currentRole=this.authservice.getLoggedInRole();
      if(this.currentRole=='user'){
        this.currentUserId=this.authservice.getUserId();
      }else{
        this.currentBusinessId=this.authservice.getBusinessId();
      }
      this.signalRServiceListners();
      this.signalRService.onNotificationCreateSignal();
    }
  }
  isBusinessUser: boolean = false;
  ngOnInit(): void {
    this.loginStateService.isLoggedIn.subscribe((status) => {
      const token = this.authservice.getToken();
      if (!token) {
        throwError(() => new Error('User is not authenticated.'));
      } else {
        const decodedToken: any = this.authservice.decodeToken();
        this.isLoggedIn = true;
        this.isBusinessUser = decodedToken.role === 'Business';
        this.fetchUserProfile(decodedToken.id); // Fetch profile if logged in
        const userId = this.authservice.getUserId();
        // Fetch unread count
        this.authservice.fetchUnReadNotificationsCount(userId).subscribe({
          next: (response: UnReadNotifications) => {
            this.unreadNotifications = response.unreadCount;
            console.log('Unread notifications:', this.unreadNotifications);
          },
          error: (error) => {
            console.error('Error fetching unread count:', error);
          },
        });
      }
    });
  }

  getNotificationCount(id){
    this.authservice.fetchUnReadNotificationsCount(id).subscribe({
      next: (response: UnReadNotifications) => {
        this.unreadNotifications = response.unreadCount;
        console.log('Unread notifications:', this.unreadNotifications);
      },
      error: (error) => {
        console.error('Error fetching unread count:', error);
      },
    });
  }
  onLogout(): void {
    this.authservice.logout();
    this.loginStateService.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  private signalRServiceListners() {
    this.signalRService.onCreateNotification$.subscribe((respo: any) => {
        if (respo) {
          debugger;
          
          if(this.currentRole=='user'){
            this.getNotificationCount(this.currentUserId);
          }
          if(this.currentRole=='business'){
            this.getNotificationCount(this.currentBusinessId);
          }
        }
    });
}

  // userProfile = {
  //   name: 'John Doe',
  //   email: 'john.doe@gmail.com',
  //   phone: '987654321',
  //   imageUrl: 'assets/images/user-profile.png'
  // };

  fetchUserProfile(userId: number): void {
    this.vehicleservice.getUserDetails(userId).subscribe(
      (response) => {
        this.userProfile = response; // Bind user profile data
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }
  // Function to open the profile modal
  openProfileModal(): void {
    this.showEditProfileModal = false; // Ensure edit modal is hidden
    this.showProfileModal = true;
  }
  // Function to close the profile modal
  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  openEditProfileModal(): void {
    this.showProfileModal = false; // not to open both modal at the same time
    this.showEditProfileModal = true;
  }

  closeEditProfileModal(): void {
    this.showEditProfileModal = false;
  }

  editProfile(): void {
    this.openEditProfileModal();
  }
  // notification(): void {
  //   this.router.navigate(['/usernotification']);
  // }
  viewBookingHistory(): void {
    // alert('Edit profile feature is coming soon!');
    this.router.navigate(['/userbookinghistory']);
    this.showProfileModal = false;
  }

  saveProfile(): void {
    // Get the decoded token for userId
    const decodedToken: any = this.authservice.decodeToken();

    // Split the full name into first and last name
    const nameParts = this.userProfile.fullName.trim().split(/\s+(.*)/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts[1] || '';

    // Prepare the request body in the required format
    const updateData = {
      firstName: firstName,
      lastName: lastName,
      contactNumber: this.userProfile.contactNumber,
      address: this.userProfile.address,
    };

    // Call the update API
    this.authservice.updateProfile(decodedToken.id, updateData).subscribe({
      next: (response) => {
        console.log('Profile updated successfully:', response);
        // Update local profile data
        this.userProfile = {
          ...this.userProfile,
          fullName: `${firstName} ${lastName}`, // Update displayed name
        };
        this.closeEditProfileModal();
        // Optionally show success message
        alert('Profile updated successfully!');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.closeProfileModal();
        alert('Profile updated successfully!');
      },
    });
  }
}
