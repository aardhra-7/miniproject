import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'web-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
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
    const map: any = { all: ' All Users', student: ' Students', faculty: ' Faculty', authority: ' Authority' };
    return map[role] || role;
  }
}
