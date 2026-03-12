import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const user = this.auth.getCurrentUser();
    const requiredRole = route.data['role'];

    if (requiredRole && user?.role !== requiredRole) {
      // Redirect to correct dashboard
      const dashMap: Record<string, string> = {
        student: '/student/dashboard',
        admin: '/admin/dashboard',
        authority: '/authority/dashboard',
        faculty: '/faculty/dashboard'
      };
      this.router.navigate([dashMap[user?.role || ''] || '/splash']);
      return false;
    }

    return true;
  }
}
