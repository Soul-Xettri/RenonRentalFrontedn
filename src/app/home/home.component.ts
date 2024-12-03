import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ModeComponent } from '../mode/mode.component';
import { LoginstateService } from '../aservice/loginstate.service';
import { AuthService } from '../aservice/auth.service';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
// import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterOutlet, ModeComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(
    private loginStateService: LoginstateService,
    private authService: AuthService
  ) {}
  isLoggedIn: boolean = false;
  ngOnInit(): void {
    this.loginStateService.isLoggedIn.subscribe((status) => {
      const token = this.authService.getToken();
      if (!token) {
        throwError(() => new Error('User is not authenticated.'));
      } else {
        this.isLoggedIn = true;
      }
    });
  }
}
