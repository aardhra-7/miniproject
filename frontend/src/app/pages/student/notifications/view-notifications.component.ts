import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-view-notifications',
    standalone: true,
    imports: [CommonModule, SidebarComponent, TopbarComponent],
    template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'student'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Notifications'"></app-topbar>
        <main class="page-content">

          <div class="page-header">
            <h1>📢 Notifications & Alerts</h1>
            <p>Stay updated with latest announcements from hostel administration.</p>
          </div>

          <div class="notif-container card">
            <div *ngIf="notifications.length === 0" class="empty-state">
              <span class="empty-icon">📭</span>
              <p>No notifications yet.</p>
            </div>

            <div *ngFor="let n of notifications" class="notif-item" [class]="'type-' + n.type">
              <div class="notif-icon">
                <span *ngIf="n.type === 'alert'">🚨</span>
                <span *ngIf="n.type === 'general' || !n.type">📋</span>
                <span *ngIf="n.type === 'attendance'">📅</span>
                <span *ngIf="n.type === 'request'">📝</span>
              </div>
              <div class="notif-content">
                <div class="notif-header">
                  <span class="notif-type">{{ (n.type || 'general') | titlecase }}</span>
                  <span class="notif-date">{{ n.createdAt | date:'medium' }}</span>
                </div>
                <h3 class="notif-title">{{ n.title }}</h3>
                <p class="notif-msg">{{ n.message }}</p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  `,
    styles: [`
    :host { display: contents; }
    .page-header { margin-bottom: 28px; }
    .page-header h1 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
    .page-header p { color: var(--muted); font-size: 14px; }

    .notif-container { padding: 8px 0; }
    .notif-item { display: flex; gap: 20px; padding: 24px; border-bottom: 1px solid var(--border); transition: background .2s; }
    .notif-item:last-child { border-bottom: none; }
    .notif-item:hover { background: rgba(0,0,0,.01); }

    .notif-icon { width: 48px; height: 48px; border-radius: 14px; background: var(--bg); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; border: 1px solid var(--border); }
    
    .notif-content { flex: 1; }
    .notif-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .notif-type { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 2px 8px; border-radius: 4px; background: var(--bg); color: var(--muted); }
    .notif-date { font-size: 11px; color: var(--muted); font-weight: 500; }
    
    .notif-title { font-size: 16px; font-weight: 700; margin-bottom: 6px; color: var(--text); }
    .notif-msg { font-size: 14px; color: var(--muted); line-height: 1.6; }

    /* Type specific colors */
    .type-alert { border-left: 4px solid #ef4444; }
    .type-alert .notif-type { color: #dc2626; background: rgba(239, 68, 68, .08); }
    
    .type-attendance { border-left: 4px solid #10b981; }
    .type-attendance .notif-type { color: #059669; background: rgba(16, 185, 129, .08); }

    .type-request { border-left: 4px solid #8b5cf6; }
    .type-request .notif-type { color: #7c3aed; background: rgba(139, 92, 246, .08); }

    .empty-state { text-align: center; padding: 60px 20px; color: var(--muted); }
    .empty-icon { font-size: 48px; display: block; margin-bottom: 16px; }
  `]
})
export class ViewNotificationsComponent implements OnInit {
    notifications: any[] = [];

    constructor(private http: HttpClient, private auth: AuthService) { }

    ngOnInit() {
        this.loadNotifications();
    }

    loadNotifications() {
        const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` });
        this.http.get<any>('http://localhost:5000/api/student/notifications', { headers }).subscribe({
            next: res => this.notifications = res.notifications || [],
            error: () => { }
        });
    }
}
