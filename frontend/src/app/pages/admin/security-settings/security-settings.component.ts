import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-security-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
    template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'admin'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'System Security'"></app-topbar>
        <main class="page-content">
          <div class="card security-card">
            <h3>Update Administrator Credentials</h3>
            <p class="subtitle">Update the primary admin email and sync with the system .env configuration.</p>
            
            <div class="form-container">
              <div class="form-group">
                <label>Admin Email Address</label>
                <input type="email" class="form-control" [(ngModel)]="email" placeholder="admin@hostel.com" />
              </div>
              
              <div class="form-group">
                <label>New System Password</label>
                <input type="password" class="form-control" [(ngModel)]="password" placeholder="••••••••" />
              </div>

              <div *ngIf="msg" [class]="msgType === 'success' ? 'success-msg' : 'error-msg'">{{ msg }}</div>

              <button class="btn-primary" (click)="saveSettings()" [disabled]="loading">
                {{ loading ? 'Updating System...' : 'Update & Sync Credentials' }}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
    styles: [`
    .security-card { max-width: 500px; margin: 40px auto; padding: 40px; }
    h3 { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
    .subtitle { color: var(--muted); font-size: 14px; margin-bottom: 32px; }
    
    .form-container { display: flex; flex-direction: column; gap: 20px; }
    .form-group label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
    .form-control { width: 100%; padding: 12px 16px; border: 2px solid var(--border); border-radius: 12px; font-size: 14px; background: var(--bg); color: var(--text); outline: none; transition: border-color .2s; }
    .form-control:focus { border-color: var(--primary); }
    
    .btn-primary { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; border: none; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; margin-top: 12px; transition: opacity .2s; }
    .btn-primary:disabled { opacity: .7; cursor: not-allowed; }
    
    .error-msg { color: #dc2626; font-size: 13px; background: #fee2e2; padding: 10px; border-radius: 8px; }
    .success-msg { color: #059669; font-size: 13px; background: #dcfce7; padding: 10px; border-radius: 8px; }
  `]
})
export class SecuritySettingsComponent {
    email = '';
    password = '';
    loading = false;
    msg = '';
    msgType = '';

    constructor(private http: HttpClient, private auth: AuthService) {
        this.email = this.auth.userValue?.email || '';
    }

    saveSettings() {
        if (!this.email || !this.password) {
            this.msg = 'Please provide both email and password for sync.';
            this.msgType = 'error';
            return;
        }

        this.loading = true;
        this.msg = '';
        const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` });

        this.http.put('http://localhost:5000/api/admin/security-settings', { email: this.email, password: this.password }, { headers }).subscribe({
            next: (res: any) => {
                this.msg = res.message;
                this.msgType = 'success';
                this.loading = false;
                this.password = '';
            },
            error: (err) => {
                this.msg = err.error?.message || 'Failed to update settings';
                this.msgType = 'error';
                this.loading = false;
            }
        });
    }
}
