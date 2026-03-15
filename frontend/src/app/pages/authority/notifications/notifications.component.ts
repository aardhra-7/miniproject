import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-authority-notifications',
    standalone: true,
    imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
    template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'authority'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Publish Notifications'"></app-topbar>
        <main class="page-content">
          
          <div class="publish-container">
            <div class="card publish-card">
              <div class="card-header">
                 <h2>📢 Create New Announcement</h2>
                 <p>Send notifications to specific roles or all hostel members.</p>
              </div>
              
              <div class="form-grid">
                <div class="form-group full">
                  <label>Notification Title</label>
                  <input type="text" [(ngModel)]="notification.title" placeholder="e.g. Mess Timing Update" />
                </div>
                
                <div class="form-group">
                  <label>Target Audience</label>
                  <select [(ngModel)]="notification.targetRole">
                    <option value="all">Everyone</option>
                    <option value="student">All Students</option>
                    <option value="faculty">All Faculty</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label>Category</label>
                  <select [(ngModel)]="notification.type">
                    <option value="general">General Info</option>
                    <option value="alert">Alert / Urgent</option>
                    <option value="attendance">Attendance Related</option>
                    <option value="request">Request Status</option>
                  </select>
                </div>
                
                <div class="form-group full">
                  <label>Message Content</label>
                  <textarea [(ngModel)]="notification.message" rows="5" placeholder="Type your announcement here..."></textarea>
                </div>
              </div>
              
              <div class="card-footer">
                <button class="btn-primary" (click)="publish()" [disabled]="publishing || !notification.title || !notification.message">
                   {{ publishing ? 'Publishing...' : '🚀 Publish Announcement' }}
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  `,
    styles: [`
    :host { display: contents; }
    .publish-container { display: flex; justify-content: center; padding-top: 20px; }
    .publish-card { width: 100%; max-width: 700px; background: var(--card); border-radius: 24px; padding: 40px; box-shadow: var(--shadow-lg); border: 1px solid var(--border); }
    
    .card-header h2 { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
    .card-header p { color: var(--muted); font-size: 14px; margin-bottom: 32px; }
    
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-group.full { grid-column: span 2; }
    
    label { font-size: 11px; font-weight: 800; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
    input, select, textarea { padding: 14px 18px; border: 2px solid var(--border); border-radius: 12px; font-size: 14px; outline: none; background: var(--bg); color: var(--text); transition: all .2s; }
    input:focus, select:focus, textarea:focus { border-color: var(--primary); background: #fff; }
    
    .card-footer { margin-top: 32px; pt: 32px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; }
    .btn-primary { background: var(--primary); color: #fff; border: none; padding: 14px 32px; border-radius: 14px; font-weight: 700; font-size: 14px; cursor: pointer; transition: transform .2s; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  `]
})
export class NotificationsComponent {
    notification = {
        title: '',
        message: '',
        targetRole: 'all',
        type: 'general'
    };
    publishing = false;

    constructor(private http: HttpClient, private auth: AuthService) { }

    get headers() {
        return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
    }

    publish() {
        this.publishing = true;
        this.http.post('http://localhost:5000/api/authority/publish-notification', this.notification, this.headers).subscribe({
            next: () => {
                alert('Notification published successfully!');
                this.notification = { title: '', message: '', targetRole: 'all', type: 'general' };
                this.publishing = false;
            },
            error: () => {
                alert('Failed to publish notification');
                this.publishing = false;
            }
        });
    }
}
