import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginstateService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private businessId = new BehaviorSubject<string | null>(null);

  // Observables for other components to subscribe to
  isLoggedIn = this.loggedIn.asObservable();
  currentBusinessId = this.businessId.asObservable();

  constructor() { }

  // Method to update login status
  setLoginStatus(status: boolean): void {
    this.loggedIn.next(status);
  }

  // Method to log out the user
  logout(): void {
    this.loggedIn.next(false);
    this.businessId.next(null);  // Reset businessId on logout
  }

  // Method to set business ID after successful login
  setBusinessId(id: string): void {
    this.businessId.next(id);
  }

  // Method to get current business ID
  getBusinessId(): string | null {
    return this.businessId.value;
  }
}
