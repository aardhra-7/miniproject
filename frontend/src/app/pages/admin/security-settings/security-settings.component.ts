import { Component, OnInit } from '@angular/core';
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

          <!-- Admin Credentials Card -->
          <div class="card security-card">
            <div class="card-icon">🔐</div>
            <h3>Administrator Credentials</h3>
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
            </div>
          </div>

          <!-- Hostel Location Settings -->
          <div class="card security-card">
            <div class="card-icon">📍</div>
            <h3>Hostel Location Settings</h3>
            <p class="subtitle">Configure the GPS coordinates and radius for student return marking verification.</p>
            
            <div class="form-container">
              <div class="form-row">
                <div class="form-group">
                  <label>Latitude</label>
                  <input type="number" step="any" class="form-control" [(ngModel)]="latitude" placeholder="e.g., 10.9337" />
                </div>
                <div class="form-group">
                  <label>Longitude</label>
                  <input type="number" step="any" class="form-control" [(ngModel)]="longitude" placeholder="e.g., 76.2673" />
                </div>
              </div>
              <div class="form-group">
                <label>Return Approval Radius (meters)</label>
                <input type="number" class="form-control" [(ngModel)]="returnRadius" placeholder="e.g., 100" />
                <span class="hint">Students within this radius can mark return and get auto-approved.</span>
              </div>
            </div>
          </div>

          <!-- Mess Cut Settings -->
          <div class="card security-card">
            <div class="card-icon">🍽️</div>
            <h3>Mess Cut Configuration</h3>
            <p class="subtitle">Set the minimum number of days for which a mess cut can be applied. Start date must always be from the next day.</p>
            
            <div class="form-container">
              <div class="form-group">
                <label>Minimum Mess Cut Days</label>
                <input type="number" class="form-control" [(ngModel)]="minMessCutDays" placeholder="e.g., 3" min="1" />
                <span class="hint">Mess cut can only be applied for at least this many days. Start date is always from the next day.</span>
              </div>
            </div>
          </div>

          <!-- Admin Transfer -->
          <div class="card security-card danger-card">
            <div class="card-icon">⚠️</div>
            <h3>Transfer Admin Role</h3>
            <p class="subtitle">Transfer the admin role for this hostel to another registered user. This action cannot be undone — you will be demoted to faculty.</p>
            
            <div class="form-container">
              <div class="form-group">
                <label>New Admin User ID</label>
                <input class="form-control" [(ngModel)]="transferUserId" placeholder="Enter user ID of the new admin" />
              </div>
              <button class="btn-danger" (click)="transferAdmin()" [disabled]="!transferUserId || transferLoading">
                {{ transferLoading ? 'Transferring...' : 'Transfer Admin Role' }}
              </button>
            </div>
          </div>

          <div *ngIf="msg" [class]="msgType === 'success' ? 'toast success-toast' : 'toast error-toast'">{{ msg }}</div>

          <button class="btn-primary save-all" (click)="saveSettings()" [disabled]="loading">
            {{ loading ? 'Updating System...' : '💾 Save All Settings' }}
          </button>

        </main>
      </div>
    </div>
  `,
  styles: [`
    .security-card { max-width: 600px; margin: 0 auto 24px; padding: 32px; position: relative; }
    .card-icon { font-size: 28px; margin-bottom: 12px; }
    h3 { font-size: 18px; font-weight: 800; margin-bottom: 6px; }
    .subtitle { color: var(--muted); font-size: 13px; margin-bottom: 24px; line-height: 1.5; }
    
    .form-container { display: flex; flex-direction: column; gap: 18px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
    .form-control { width: 100%; padding: 12px 16px; border: 2px solid var(--border); border-radius: 12px; font-size: 14px; background: var(--bg); color: var(--text); outline: none; transition: border-color .2s; }
    .form-control:focus { border-color: var(--primary); }
    .hint { display: block; font-size: 11px; color: var(--muted); margin-top: 6px; line-height: 1.4; }
    
    .save-all { display: block; max-width: 600px; margin: 0 auto; width: 100%; background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; border: none; padding: 16px; border-radius: 14px; font-weight: 700; font-size: 15px; cursor: pointer; transition: opacity .2s, transform .1s; }
    .save-all:hover { transform: translateY(-1px); }
    .save-all:disabled { opacity: .7; cursor: not-allowed; transform: none; }

    .danger-card { border: 2px solid rgba(239,68,68,.2); }
    .danger-card h3 { color: #dc2626; }
    .btn-danger { background: linear-gradient(135deg, #dc2626, #ef4444); color: #fff; border: none; padding: 12px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: opacity .2s; }
    .btn-danger:disabled { opacity: .6; cursor: not-allowed; }
    
    .toast { max-width: 600px; margin: 0 auto 16px; padding: 14px 20px; border-radius: 12px; font-size: 13px; font-weight: 600; text-align: center; animation: slideIn .3s ease; }
    .error-toast { color: #dc2626; background: #fee2e2; border: 1px solid #fecaca; }
    .success-toast { color: #059669; background: #dcfce7; border: 1px solid #bbf7d0; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class SecuritySettingsComponent implements OnInit {
  email = '';
  password = '';
  latitude = 0;
  longitude = 0;
  returnRadius = 100;
  minMessCutDays = 3;
  transferUserId = '';
  loading = false;
  transferLoading = false;
  msg = '';
  msgType = '';

  constructor(private http: HttpClient, private auth: AuthService) {
    this.email = this.auth.userValue?.email || '';
  }

  ngOnInit() {
    this.loadHostelSettings();
  }

  get headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` });
  }

  loadHostelSettings() {
    this.http.get<any>('http://localhost:5000/api/admin/hostel-settings', { headers: this.headers }).subscribe({
      next: (res) => {
        if (res.settings) {
          this.latitude = res.settings.locationCoordinates?.latitude || 0;
          this.longitude = res.settings.locationCoordinates?.longitude || 0;
          this.returnRadius = res.settings.returnRadius || 100;
          this.minMessCutDays = res.settings.minMessCutDays || 3;
        }
      },
      error: () => { }
    });
  }

  saveSettings() {
    this.loading = true;
    this.msg = '';

    const body: any = {
      locationCoordinates: { latitude: this.latitude, longitude: this.longitude },
      returnRadius: this.returnRadius,
      minMessCutDays: this.minMessCutDays
    };

    if (this.email) body.email = this.email;
    if (this.password) body.password = this.password;

    this.http.put('http://localhost:5000/api/admin/security-settings', body, { headers: this.headers }).subscribe({
      next: (res: any) => {
        this.msg = res.message || 'Settings updated successfully';
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

  transferAdmin() {
    if (!this.transferUserId) return;
    if (!confirm(`Are you sure you want to transfer admin role to "${this.transferUserId}"? You will be demoted to faculty. This cannot be undone.`)) return;

    this.transferLoading = true;
    this.msg = '';

    this.http.post('http://localhost:5000/api/admin/transfer-admin', { newAdminUserId: this.transferUserId }, { headers: this.headers }).subscribe({
      next: (res: any) => {
        this.msg = res.message || 'Admin transferred!';
        this.msgType = 'success';
        this.transferLoading = false;
        // Log out since user is no longer admin
        setTimeout(() => {
          this.auth.logout();
          window.location.href = '/login';
        }, 2000);
      },
      error: (err) => {
        this.msg = err.error?.message || 'Failed to transfer admin';
        this.msgType = 'error';
        this.transferLoading = false;
      }
    });
  }
}
