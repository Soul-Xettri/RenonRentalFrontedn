import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../aservice/auth.service';
import { LoginstateService } from '../aservice/loginstate.service';
import { CommonModule } from '@angular/common';
import jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterOutlet, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loggedUserData: any;

  // Object for login
  loginObj: any = {
    email: '',
    password: ''
  };

  showPassword = false;
  isLoading = false; //Loading state

  constructor(
    private authService: AuthService,
    private router: Router,
    private loginStateService: LoginstateService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    console.log('Login Object:', this.loginObj);
    this.isLoading = true; // Set loading to true when login starts
  
    this.authService.loginUser(this.loginObj).subscribe(
      (res: any) => {
        if (res) {
          console.log('Login successful', res);
  
          // Save the token
          this.authService.setToken(res.accessToken);
  
          try {
            const decodedToken: any = jwt_decode(res.accessToken);
            const userRole = decodedToken.role;
            const businessId = decodedToken.id; 

            console.log('Decoded Token:', decodedToken);
          console.log('User Role:', userRole);
          
  
          
  
          // Update login state
          this.loginStateService.setLoginStatus(true);
          // Store the businessId in the LoginstateService
          this.loginStateService.setBusinessId(businessId);
  
          // Navigate based on role
          if (userRole === 'Business') {
            this.router.navigate(['/dashboard']); // Navigate to dashboard for Business role
          } else if (userRole === 'User') {
            this.router.navigate(['/search']); // Navigate to search for User role
          } else {
            console.error('Unknown role:', userRole);
            alert('Invalid role detected.');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          alert('Invalid token received.');
          return;
        }
        }
      
      },
      (err) => {
        this.isLoading = false;
        console.error('Login failed', err);
        alert('Invalid email or password.');
      },
      () => {
        this.isLoading = false; // Set loading to false after login completes
      }
    );
  }
}