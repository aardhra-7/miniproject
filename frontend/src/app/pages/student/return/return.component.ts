import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-return',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'student'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Mark Return'"></app-topbar>
        <main class="page-content">

          <div class="page-header">
            <h1>Mark Return</h1>
            <p>Confirm your arrival back at the hostel using GPS verification.</p>
          </div>

          <div class="content-grid">
            <!-- GPS Card -->
            <div class="card gps-card" [class.located]="located">
              <div class="gps-icon">{{ located ? '✅' : '📍' }}</div>
              <h3>GPS Verification</h3>
              <p>You must be within the specified hostel radius to mark your return successfully.</p>

              <div class="location-status" *ngIf="located">
                <span>Latitude: <strong>{{ lat?.toFixed(6) }}</strong></span>
                <span>Longitude: <strong>{{ lng?.toFixed(6) }}</strong></span>
              </div>

              <button class="btn-gps" (click)="getLocation()" [disabled]="locating">
                {{ locating ? '⏳ Detecting Location...' : located ? '📡 Refresh Location' : '📡 Get My Location' }}
              </button>
            </div>

            <!-- Return Form -->
            <div class="card">
              <h3 class="card-title">Select Active Outing</h3>

              <div class="form-group">
                <label>Category</label>
                <div class="category-toggle">
                   <button [class.active]="type === 'outgoing'" (click)="type = 'outgoing'; loadPendingRecords()">Outgoing</button>
                   <button [class.active]="type === 'homegoing'" (click)="type = 'homegoing'; loadPendingRecords()">Home Going</button>
                </div>
              </div>

              <div class="form-group">
                <label>Choose Record *</label>
                <select class="form-control" [(ngModel)]="selectedId">
                  <option value="">-- Select Pending Return --</option>
                  <option *ngFor="let r of pendingRecords" [value]="r._id">
                    {{ r.place }} (Left: {{ (r.date || r.leaveDate) | date:'dd MMM, hh:mm a' }})
                  </option>
                </select>
                <div *ngIf="pendingRecords.length === 0 && !loading" class="no-records-hint">
                   No pending {{ type }}s found to return from.
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Return Date</label>
                  <input type="date" class="form-control" [(ngModel)]="returnDate" />
                </div>
                <div class="form-group">
                  <label>Return Time</label>
                  <input type="time" class="form-control" [(ngModel)]="returnTime" />
                </div>
              </div>

              <div *ngIf="msg" [class]="msgType === 'success' ? 'msg-success' : 'msg-error'">{{ msg }}</div>

              <button class="btn-primary" (click)="markReturn()" [disabled]="!located || !selectedId || loading">
                {{ loading ? 'Updating...' : '✅ Confirm Return' }}
              </button>
            </div>
          </div>

          <!-- Recent History -->
          <div class="card mt">
            <h3 class="card-title">Recent Returns</h3>
            <div *ngIf="returnHistory.length === 0" class="empty-state">No recent returns.</div>
            <div class="history-list">
              <div *ngFor="let h of returnHistory" class="history-item">
                <div class="item-main">
                  <div class="item-title">{{ h.place }}</div>
                  <div class="item-meta">Returned: {{ h.returnDate | date:'dd MMM yyyy' }} at {{ h.returnTime }}</div>
                </div>
                <span class="badge badge-returned">Returned</span>
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

    .content-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; }
    @media(max-width: 900px) { .content-grid { grid-template-columns: 1fr; } }

    .card { background: var(--card); border-radius: 20px; padding: 28px; box-shadow: var(--shadow); }
    .card-title { font-size: 16px; font-weight: 700; margin-bottom: 20px; }

    .gps-card { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; border: 2px solid transparent; }
    .gps-card.located { border-color: #10b981; background: rgba(16, 185, 129, .02); }
    .gps-icon { font-size: 48px; margin-bottom: 8px; }
    .gps-card p { font-size: 13px; color: var(--muted); line-height: 1.5; max-width: 240px; }
    .location-status { display: flex; flex-direction: column; font-size: 12px; font-weight: 700; color: #059669; padding: 12px; background: rgba(16, 185, 129, .08); border-radius: 12px; }
    
    .btn-gps { background: var(--bg); border: 2px solid var(--primary); color: var(--primary); padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 13px; cursor: pointer; transition: all .2s; }
    .btn-gps:hover { background: var(--primary); color: #fff; }

    .category-toggle { display: flex; gap: 8px; background: var(--bg); padding: 4px; border-radius: 12px; border: 1px solid var(--border); }
    .category-toggle button { flex: 1; border: none; background: none; padding: 8px; font-size: 13px; font-weight: 700; border-radius: 8px; cursor: pointer; color: var(--muted); }
    .category-toggle button.active { background: var(--card); color: var(--primary); box-shadow: 0 2px 4px rgba(0,0,0,.05); }

    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px; }
    .form-control { width: 100%; padding: 12px 16px; border: 2px solid var(--border); border-radius: 12px; font-size: 14px; outline: none; background: var(--bg); color: var(--text); }
    .form-control:focus { border-color: var(--primary); }
    .no-records-hint { font-size: 12px; color: #dc2626; margin-top: 8px; font-weight: 600; }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .btn-primary { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; border: none; padding: 14px; border-radius: 14px; font-weight: 700; font-size: 14px; cursor: pointer; width: 100%; margin-top: 8px; transition: transform .2s; }
    .btn-primary:active { transform: scale(.98); }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }

    .msg-success { color: #059669; background: #dcfce7; padding: 12px; border-radius: 10px; font-size: 13px; font-weight: 600; margin-bottom: 12px; }
    .msg-error { color: #dc2626; background: #fee2e2; padding: 12px; border-radius: 10px; font-size: 13px; font-weight: 600; margin-bottom: 12px; }

    .mt { margin-top: 24px; }
    .history-list { display: flex; flex-direction: column; gap: 12px; }
    .history-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid var(--border); border-radius: 14px; }
    .item-title { font-weight: 700; font-size: 14px; margin-bottom: 2px; }
    .item-meta { font-size: 12px; color: var(--muted); }
    .badge-returned { background: rgba(16, 185, 129, .12); color: #059669; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
    .empty-state { text-align: center; color: var(--muted); padding: 40px; font-size: 14px; }
  `]
})
export class ReturnComponent implements OnInit {
  lat: number | null = null;
  lng: number | null = null;
  located = false;
  locating = false;
  type = 'outgoing';
  selectedId = '';
  returnDate = new Date().toISOString().split('T')[0];
  returnTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  pendingRecords: any[] = [];
  returnHistory: any[] = [];
  loading = false;
  msg = '';
  msgType = '';

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.loadPendingRecords();
  }

  get headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
  }

  getLocation() {
    if ('geolocation' in navigator) {
      this.locating = true;
      this.msg = '';
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.lat = pos.coords.latitude;
          this.lng = pos.coords.longitude;
          this.located = true;
          this.locating = false;
        },
        err => {
          this.msg = 'Location access denied. Please allow GPS to mark return.';
          this.msgType = 'error';
          this.locating = false;
        },
        { enableHighAccuracy: true }
      );
    } else {
      this.msg = 'Geolocation not supported.';
      this.msgType = 'error';
    }
  }

  loadPendingRecords() {
    const endpoint = this.type === 'outgoing' ? 'outgoing' : 'home-going';
    this.selectedId = '';
    this.msg = '';

    this.http.get<any>(`http://localhost:5000/api/student/${endpoint}`, this.headers).subscribe({
      next: r => {
        const all = r.outgoings || r.homeGoings || [];
        // Pending return means status is 'active' OR 'approved' (for homegoing) and not yet returned
        this.pendingRecords = all.filter((x: any) => (x.status === 'active' || x.status === 'approved') && !x.isReturned);
        this.returnHistory = all.filter((x: any) => x.status === 'returned' || x.isReturned).slice(0, 5);
      },
      error: () => { }
    });
  }

  markReturn() {
    if (!this.located || !this.selectedId) return;
    this.loading = true;
    this.msg = '';

    this.http.post<any>('http://localhost:5000/api/student/return', {
      type: this.type,
      requestId: this.selectedId,
      latitude: this.lat,
      longitude: this.lng,
      returnDate: this.returnDate,
      returnTime: this.returnTime
    }, this.headers).subscribe({
      next: res => {
        this.msg = res.message || 'Return marked successfully!';
        this.msgType = 'success';
        this.loading = false;
        this.selectedId = '';
        this.loadPendingRecords();
      },
      error: err => {
        this.msg = err.error?.message || 'Return marking failed.';
        this.msgType = 'error';
        this.loading = false;
      }
    });
  }
}
