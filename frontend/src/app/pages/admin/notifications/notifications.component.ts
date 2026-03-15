import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
    template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'admin'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Notifications'"></app-topbar>
        <main class="page-content">

          <div class="page-header">
            <h1>📢 Publish Notifications</h1>
            <p>Send announcements to specific roles or broadcast to all users.</p>
          </div>

          <!-- Compose Notification -->
          <div class="card compose-card">
            <div class="compose-header">
              <h3>✉️ Compose Notification</h3>
            </div>
            <div class="form-container">
              <div class="form-row">
                <div class="form-group">
                  <label>Target Audience</label>
                  <select class="form-control" [(ngModel)]="targetRole">
                    <option value="all">📣 All Users</option>
                    <option value="student">🎓 Students Only</option>
                    <option value="faculty">👨‍🏫 Faculty Only</option>
                    <option value="authority">🏛️ Authority Only</option>
                    <option value="admin">🛡️ Admins Only</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Notification Type</label>
                  <select class="form-control" [(ngModel)]="type">
                    <option value="general">📋 General</option>
                    <option value="alert">🚨 Alert</option>
                    <option value="attendance">📅 Attendance</option>
                    <option value="request">📝 Request</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Title *</label>
                <input class="form-control" [(ngModel)]="title" placeholder="Enter notification title..." />
              </div>
              <div class="form-group">
                <label>Message *</label>
                <textarea class="form-control msg-area" [(ngModel)]="message" rows="4" placeholder="Type your notification message here..."></textarea>
              </div>

              <div *ngIf="publishMsg" [class]="publishMsgType === 'success' ? 'msg-success' : 'msg-error'">
                {{ publishMsg }}
              </div>

              <button class="btn-publish" (click)="publishNotification()" [disabled]="!title || !message || publishing">
                {{ publishing ? 'Publishing...' : '🚀 Publish Notification' }}
              </button>
            </div>
          </div>

          <!-- Published Notifications History -->
          <div class="card history-card">
            <div class="card-header">
              <h3>📜 Published History</h3>
              <span class="count-badge">{{ notifications.length }} Total</span>
            </div>

            <div *ngIf="notifications.length === 0" class="empty-state">
              <span class="empty-icon">📭</span>
              <p>No notifications published yet.</p>
            </div>

            <div *ngFor="let n of notifications" class="notif-item">
              <div class="notif-content">
                <div class="notif-top">
                  <span [class]="'type-badge type-' + n.type">{{ n.type | titlecase }}</span>
                  <span class="target-badge">{{ getTargetLabel(n.targetRole) }}</span>
                  <span class="notif-time">{{ n.createdAt | date:'medium' }}</span>
                </div>
                <h4 class="notif-title">{{ n.title }}</h4>
                <p class="notif-msg">{{ n.message }}</p>
              </div>
              <button class="btn-delete" (click)="deleteNotification(n._id)" title="Delete">🗑️</button>
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

    .compose-card { padding: 32px; margin-bottom: 24px; }
    .compose-header h3 { font-size: 17px; font-weight: 700; margin-bottom: 20px; }
    .form-container { display: flex; flex-direction: column; gap: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px; }
    .form-control { width: 100%; padding: 12px 16px; border: 2px solid var(--border); border-radius: 12px; font-size: 14px; background: var(--bg); color: var(--text); outline: none; transition: border-color .2s; font-family: inherit; }
    .form-control:focus { border-color: var(--primary); }
    .msg-area { resize: vertical; min-height: 100px; }

    .btn-publish { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; border: none; padding: 14px 24px; border-radius: 14px; font-weight: 700; font-size: 15px; cursor: pointer; transition: opacity .2s, transform .1s; }
    .btn-publish:hover { transform: translateY(-1px); }
    .btn-publish:disabled { opacity: .6; cursor: not-allowed; transform: none; }

    .msg-success { color: #059669; background: #dcfce7; padding: 12px; border-radius: 10px; font-size: 13px; font-weight: 600; border: 1px solid #bbf7d0; }
    .msg-error { color: #dc2626; background: #fee2e2; padding: 12px; border-radius: 10px; font-size: 13px; font-weight: 600; border: 1px solid #fecaca; }

    .history-card { padding: 24px; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
    .card-header h3 { font-size: 17px; font-weight: 700; margin: 0; }
    .count-badge { background: var(--bg); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; color: var(--muted); }

    .empty-state { text-align: center; padding: 48px 20px; }
    .empty-icon { font-size: 48px; display: block; margin-bottom: 12px; }
    .empty-state p { color: var(--muted); font-size: 14px; }

    .notif-item { display: flex; gap: 16px; padding: 18px 0; border-bottom: 1px solid var(--border); align-items: flex-start; }
    .notif-item:last-child { border-bottom: none; }
    .notif-content { flex: 1; }
    .notif-top { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 8px; }
    .type-badge { padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .type-general { background: rgba(14,165,233,.12); color: #0284c7; }
    .type-alert { background: rgba(239,68,68,.12); color: #dc2626; }
    .type-attendance { background: rgba(16,185,129,.12); color: #059669; }
    .type-request { background: rgba(139,92,246,.12); color: #7c3aed; }
    .target-badge { background: rgba(245,158,11,.1); color: #d97706; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .notif-time { font-size: 11px; color: var(--muted); margin-left: auto; }
    .notif-title { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
    .notif-msg { font-size: 13px; color: var(--muted); line-height: 1.5; }

    .btn-delete { background: none; border: none; cursor: pointer; font-size: 16px; padding: 6px; border-radius: 8px; transition: background .2s; flex-shrink: 0; }
    .btn-delete:hover { background: rgba(239,68,68,.1); }
  `]
})
export class NotificationsComponent implements OnInit {
    title = '';
    message = '';
    targetRole = 'all';
    type = 'general';
    publishing = false;
    publishMsg = '';
    publishMsgType = '';
    notifications: any[] = [];

    constructor(private http: HttpClient, private auth: AuthService) { }

    ngOnInit() { this.loadNotifications(); }

    get headers() {
        return new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` });
    }

    loadNotifications() {
        this.http.get<any>('http://localhost:5000/api/admin/notifications', { headers: this.headers }).subscribe({
            next: res => { this.notifications = res.notifications || []; },
            error: () => { }
        });
    }

    publishNotification() {
        if (!this.title || !this.message) return;
        this.publishing = true;
        this.publishMsg = '';

        this.http.post('http://localhost:5000/api/admin/publish-notification', {
            title: this.title,
            message: this.message,
            targetRole: this.targetRole,
            type: this.type
        }, { headers: this.headers }).subscribe({
            next: (res: any) => {
                this.publishMsg = res.message || 'Notification published!';
                this.publishMsgType = 'success';
                this.publishing = false;
                this.title = '';
                this.message = '';
                this.loadNotifications();
            },
            error: err => {
                this.publishMsg = err.error?.message || 'Failed to publish';
                this.publishMsgType = 'error';
                this.publishing = false;
            }
        });
    }

    deleteNotification(id: string) {
        if (!confirm('Delete this notification?')) return;
        this.http.delete(`http://localhost:5000/api/admin/notifications/${id}`, { headers: this.headers }).subscribe({
            next: () => this.loadNotifications(),
            error: () => alert('Failed to delete notification.')
        });
    }

    getTargetLabel(role: string): string {
        const map: any = { all: '📣 All Users', student: '🎓 Students', faculty: '👨‍🏫 Faculty', authority: '🏛️ Authority', admin: '🛡️ Admins' };
        return map[role] || role;
    }
}
