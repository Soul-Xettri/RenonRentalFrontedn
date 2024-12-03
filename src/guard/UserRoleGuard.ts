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
class UserRoleGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const decoded = this.authService.decodeToken();
    const userRole = decoded?.role || 'public';
    if (userRole !== 'Business') {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}

export { UserRoleGuard };
