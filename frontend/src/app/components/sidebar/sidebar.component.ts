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
        <div class="sidebar-logo-sub"> Hostel Management System </div>
      </div>
      
      <div class="sidebar-user">
        <div class="user-avatar">
          <i class="bi bi-person-circle"></i>
        </div>
        <div class="user-info">
          <div class="sidebar-user-name">{{ userName }}</div>
          <div class="sidebar-user-role">{{ role | titlecase }}</div>
        </div>
      </div>

      <div class="sidebar-nav">
        <div class="nav-section-label">Main</div>
        <a class="nav-item" routerLinkActive="active" [routerLink]="['/' + role + '/dashboard']">
          <i class="bi bi-house-door-fill"></i> Dashboard
        </a>
        
        <!-- Student  -->
        <ng-container *ngIf="role === 'student'">
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/' + role + '/profile']">
            <i class="bi bi-person-badge-fill"></i> My Profile
          </a>
          
          <div class="nav-section-label">Tracking</div>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/' + role + '/attendance']">
            <i class="bi bi-calendar-check-fill"></i> Attendance
          </a>
          
          <div class="nav-section-label">Forms</div>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/' + role + '/mess-cut']">
            <i class="bi bi-cup-hot-fill"></i> Mess Cut
          </a>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/' + role + '/outgoing']">
            <i class="bi bi-door-open-fill"></i> Outgoing
          </a>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/' + role + '/home-going']">
            <i class="bi bi-house-up-fill"></i> Home Going
          </a>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/' + role + '/return']">
            <i class="bi bi-geo-alt-fill"></i> Mark Return
          </a>

          <div class="nav-section-label">Other</div>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/' + role + '/notifications']">
            <i class="bi bi-bell-fill"></i> Notifications
          </a>
        </ng-container>

        <!-- Admin -->
        <ng-container *ngIf="role === 'admin'">
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/admin/users']">
            <i class="bi bi-people-fill"></i> User Management
          </a>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/admin/notifications']">
            <i class="bi bi-megaphone-fill"></i> Notifications
          </a>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/admin/security']">
            <i class="bi bi-shield-lock-fill"></i> Security
          </a>
        </ng-container>

        <!-- Authority -->
        <ng-container *ngIf="role === 'authority'">
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/authority/requests']">
            <i class="bi bi-check2-circle"></i> Approvals
          </a>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/authority/notifications']">
            <i class="bi bi-send-fill"></i> Announcements
          </a>
          <div class="nav-section-label">Directories</div>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/authority/student-profiles']">
            <i class="bi bi-mortarboard-fill"></i> Students
          </a>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/authority/faculty-profiles']">
            <i class="bi bi-briefcase-fill"></i> Faculty
          </a>
        </ng-container>

        <!-- Faculty -->
        <ng-container *ngIf="role === 'faculty'">
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/faculty/dashboard']" [queryParams]="{tab: 'attendance'}">
            <i class="bi bi-calendar2-check-fill"></i> Attendance
          </a>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/faculty/dashboard']" [queryParams]="{tab: 'mess-cut'}">
            <i class="bi bi-cup-straw"></i> Mess Cut
          </a>
          <a class="nav-item" routerLinkActive="active" [routerLink]="['/faculty/dashboard']" [queryParams]="{tab: 'home-going'}">
            <i class="bi bi-houses-fill"></i> Home Going
          </a>
        </ng-container>
      </div>

      <div class="sidebar-footer">
        <button class="btn-logout" (click)="logout()">
          <i class="bi bi-box-arrow-right"></i> Sign Out
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      background: #0c0a1f;
      color: #fff;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 100;
      box-shadow: 4px 0 24px rgba(0,0,0,0.2);
    }

    .sidebar-logo {
      padding: 32px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .sidebar-logo-text {
      font-family: 'Poppins', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: #fff;
    }

    .sidebar-logo-text span {
      color: var(--primary);
    }

    .sidebar-logo-sub {
      font-size: 10px;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 4px;
    }

    .sidebar-user {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255,255,255,0.03);
    }

    .user-avatar {
      font-size: 32px;
      color: var(--primary);
    }

    .user-info {
        overflow: hidden;
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
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .sidebar-nav {
      flex: 1;
      padding: 20px 0;
      overflow-y: auto;
    }

    .nav-section-label {
      padding: 20px 24px 8px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: rgba(255, 255, 255, 0.2);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 24px;
      color: rgba(255,255,255,0.6);
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
    }

    .nav-item i {
      font-size: 18px;
    }

    .nav-item:hover {
      color: #fff;
      background: rgba(124, 58, 237, 0.1);
    }

    .nav-item.active {
      color: #fff;
      background: linear-gradient(90deg, rgba(124, 58, 237, 0.2), transparent);
      border-right: 3px solid var(--primary);
    }

    .sidebar-footer {
      padding: 20px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .btn-logout {
      width: 100%;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #fca5a5;
      padding: 12px;
      border-radius: 12px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.2s;
    }

    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: #ef4444;
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
