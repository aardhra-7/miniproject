import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sidebar">
      <div class="sidebar-logo">
        <div class="sidebar-logo-text">Stay<span>Sphere</span></div>
        <div class="sidebar-logo-sub">Hostel Management</div>
      </div>
      
      <div class="sidebar-user">
        <div class="sidebar-user-name">{{ userName }}</div>
        <div class="sidebar-user-role">{{ role | titlecase }} Portal</div>
      </div>

      <div class="sidebar-nav">
        <div class="nav-section-label">Main</div>
        <a class="nav-item" routerLinkActive="active" [routerLink]="['/' + role + '/dashboard']">
          <span class="nav-icon">🏠</span> Dashboard
        </a>
        
        <ng-container *ngIf="role === 'student'">
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/' + role + '/profile']">
            <span class="nav-icon">👤</span> My Profile
          </a>
          <div class="nav-section-label">Attendance</div>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/' + role + '/attendance']">
            <span class="nav-icon">📅</span> Attendance View
          </a>
          <div class="nav-section-label">Requests</div>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/' + role + '/mess-cut']">
            <span class="nav-icon">🍽️</span> Mess Cut
          </a>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/' + role + '/outgoing']">
            <span class="nav-icon">🚶</span> Outgoing
          </a>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/' + role + '/home-going']">
            <span class="nav-icon">🏡</span> Home Going
          </a>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/' + role + '/return']">
            <span class="nav-icon">↩️</span> Mark Return
          </a>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/' + role + '/notifications']">
            <span class="nav-icon">📢</span> Notifications
          </a>
        </ng-container>

        <ng-container *ngIf="role === 'admin'">
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/admin/users']">
            <span class="nav-icon">👥</span> User Management
          </a>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/admin/notifications']">
            <span class="nav-icon">📢</span> Notifications
          </a>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/admin/security']">
            <span class="nav-icon">🛡️</span> Security Settings
          </a>
        </ng-container>

        <ng-container *ngIf="role === 'authority'">
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/authority/requests']">
            <span class="nav-icon">📋</span> Request Approval
          </a>
        </ng-container>
      </div>

      <div class="sidebar-footer">
        <button class="btn-logout" (click)="logout()">🚪 Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      background: var(--sidebar);
      color: #fff;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 100;
      overflow-y: auto;
    }

    .sidebar-logo {
      padding: 24px 20px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, .08);
    }

    .sidebar-logo-text {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: #fff;
    }

    .sidebar-logo-text span {
      color: #60a5fa;
    }

    .sidebar-logo-sub {
      font-size: 10px;
      color: var(--sidebar-text);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 2px;
    }

    .sidebar-user {
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, .08);
    }

    .sidebar-user-name {
      font-weight: 600;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sidebar-user-role {
      font-size: 11px;
      color: var(--sidebar-text);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .sidebar-nav {
      flex: 1;
      padding: 12px 0;
    }

    .nav-section-label {
      padding: 8px 20px 4px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: rgba(255, 255, 255, .3);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 20px;
      cursor: pointer;
      transition: all .15s;
      color: var(--sidebar-text);
      font-size: 14px;
      border-left: 3px solid transparent;
      margin: 1px 0;
      text-decoration: none;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, .05);
      color: #fff;
    }

    .nav-item.active {
      background: rgba(26, 86, 219, .2);
      color: #fff;
      border-left-color: var(--primary);
    }

    .nav-icon {
      font-size: 18px;
      width: 22px;
      text-align: center;
    }

    .sidebar-footer {
      padding: 16px 20px;
      border-top: 1px solid rgba(255, 255, 255, .08);
    }

    .btn-logout {
      width: 100%;
      background: rgba(239, 68, 68, .15);
      border: 1px solid rgba(239, 68, 68, .3);
      color: #fca5a5;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 14px;
      transition: all .2s;
    }

    .btn-logout:hover {
      background: rgba(239, 68, 68, .25);
    }
  `]
})
export class SidebarComponent {
  @Input() role: string = 'student';

  constructor(private authService: AuthService, private router: Router) { }

  get userName(): string {
    return this.authService.userValue?.name || 'User';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/splash']);
  }
}
