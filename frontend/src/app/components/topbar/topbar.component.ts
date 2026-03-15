import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <div class="topbar-left">
        <button class="secondary-btn btn-back" (click)="goBack()">
          <i class="bi bi-chevron-left"></i> <span>Back</span>
        </button>
        <div class="topbar-title">{{ pageTitle }}</div>
      </div>
      
      <div class="topbar-actions">
        <div class="notif-wrapper">
          <button class="icon-btn" (click)="toggleNotifications()" [class.has-notif]="latestNotification">
            <i class="bi bi-bell"></i>
            <span class="notif-dot" *ngIf="latestNotification"></span>
          </button>
          
          <div class="notif-dropdown animate-fade-in" *ngIf="showNotifications" (click)="$event.stopPropagation()">
            <div class="notif-header">
               <span>Recent Notification</span>
               <i class="bi bi-x-lg close-notif" (click)="showNotifications = false"></i>
            </div>
            <div class="notif-body" *ngIf="latestNotification">
              <div class="notif-item">
                <div class="notif-title">{{ latestNotification.title }}</div>
                <div class="notif-msg">{{ latestNotification.message }}</div>
                <div class="notif-time">
                  <i class="bi bi-clock-history"></i> {{ latestNotification.createdAt | date:'shortTime' }}
                </div>
              </div>
            </div>
            <div class="notif-empty" *ngIf="!latestNotification">
              <i class="bi bi-bell-slash"></i>
              <p>All caught up!</p>
            </div>
          </div>
        </div>

        <div class="user-profile-chip">
          <div class="user-details">
            <span class="u-name">{{ userName }}</span>
            <span class="u-role">{{ auth.userValue?.role | titlecase }}</span>
          </div>
          <div class="u-avatar">{{ userInitials }}</div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid #E5E7EB;
      padding: 0 32px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 90;
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .btn-back {
      padding: 8px 16px;
      font-size: 13px;
      border-radius: 10px;
    }

    .topbar-title {
      font-family: 'Poppins', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: var(--text-dark);
    }

    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .icon-btn {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      background: #fff;
      cursor: pointer;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      color: var(--text-light);
      transition: all 0.2s;
    }

    .icon-btn:hover {
      background: #F9FAFB;
      color: var(--primary);
      border-color: var(--primary-light);
    }

    .icon-btn.has-notif {
       color: var(--primary);
    }

    .notif-dot {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid #fff;
    }

    .notif-wrapper { position: relative; }
    
    .notif-dropdown {
      position: absolute;
      top: 56px;
      right: 0;
      width: 320px;
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      z-index: 1000;
      overflow: hidden;
      border: 1px solid #eee;
    }

    .notif-header {
      padding: 16px 20px;
      background: #F9FAFB;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
      font-size: 14px;
    }

    .close-notif { cursor: pointer; color: var(--text-light); }

    .notif-item { padding: 20px; }
    .notif-title { font-weight: 700; font-size: 15px; margin-bottom: 6px; color: var(--text-dark); }
    .notif-msg { font-size: 13px; color: var(--text-light); line-height: 1.5; margin-bottom: 12px; }
    .notif-time { font-size: 11px; color: var(--primary); font-weight: 600; display: flex; align-items: center; gap: 4px; }

    .notif-empty { text-align: center; padding: 40px 20px; color: var(--text-light); }
    .notif-empty i { font-size: 32px; display: block; margin-bottom: 12px; opacity: 0.3; }

    .user-profile-chip {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 6px 6px 6px 18px;
      background: #fff;
      border-radius: 14px;
      border: 1px solid #E5E7EB;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .u-name { font-size: 13px; font-weight: 700; color: var(--text-dark); }
    .u-role { font-size: 11px; color: var(--primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

    .u-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 4px 10px rgba(124, 58, 237, 0.2);
    }
  `]
})
export class TopbarComponent implements OnInit {
  @Input() pageTitle: string = 'Dashboard';
  @Input() userName: string = 'User';

  showNotifications = false;
  latestNotification: any = null;

  constructor(
    private location: Location,
    private http: HttpClient,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.fetchLatestNotification();
  }

  fetchLatestNotification() {
    const role = this.auth.userValue?.role;
    if (!role) return;

    this.http.get<any>(`http://localhost:5000/api/${role}/notifications`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` })
    }).subscribe({
      next: res => {
        const notifications = res.notifications || [];
        if (notifications.length > 0) {
          this.latestNotification = notifications[0];
        }
      }
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  get userInitials(): string {
    if (!this.userName) return 'U';
    return this.userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  goBack() {
    this.location.back();
  }
}
