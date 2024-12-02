import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../app/aservice/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessRoleGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const allowedRoles = next.data['allowedRoles'];
    const decoded = this.authService.decodeToken();
    const userRole = decoded.role;
    console.log("userRole", userRole);
    if (userRole === 'Business') {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
