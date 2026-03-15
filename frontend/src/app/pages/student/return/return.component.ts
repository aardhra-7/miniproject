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
            <p>Use your GPS to confirm you are back inside hostel premises.</p>
          </div>

          <div class="content-grid">
            <!-- GPS Card -->
            <div class="card gps-card">
              <div class="gps-icon">📍</div>
              <h3>GPS Location Check</h3>
              <p>Your current location must be within hostel premises (200m radius) to mark return.</p>

              <div class="location-status" [class.located]="located">
                <span *ngIf="!located && !locating">Location not captured</span>
                <span *ngIf="locating">Detecting location...</span>
                <span *ngIf="located">
                  ✅ Location: {{ lat?.toFixed(4) }}, {{ lng?.toFixed(4) }}
                </span>
              </div>

              <button class="btn-secondary" (click)="getLocation()" [disabled]="locating">
                {{ locating ? '⏳ Detecting...' : '📡 Get My Location' }}
              </button>
            </div>

            <!-- Return Form -->
            <div class="card">
              <h3 class="card-title">Mark Return</h3>

              <div class="form-group">
                <label>Request Type</label>
                <select class="form-control" [(ngModel)]="type">
                  <option value="outgoing">Outgoing</option>
                  <option value="homegoing">Home Going</option>
                </select>
              </div>

              <div class="form-group">
                <label>Select Request</label>
                <select class="form-control" [(ngModel)]="selectedId">
                  <option value="">-- Select --</option>
                  <option *ngFor="let r of pendingRecords" [value]="r._id">
                    {{ r.place || r.reason }} ({{ r.date | date:'dd MMM' }})
                  </option>
                </select>
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

              <div *ngIf="msg" [class]="msgType === 'success' ? 'success-msg' : 'error-msg'">{{ msg }}</div>

              <button class="btn-primary" (click)="markReturn()" [disabled]="!located || !selectedId || loading">
                {{ loading ? 'Marking...' : '✅ Mark Return' }}
              </button>
            </div>
          </div>

          <!-- Recent Returns -->
          <div class="card mt">
            <h3 class="card-title">Recent Return History</h3>
            <div *ngIf="returnHistory.length === 0" class="empty-state">No return records yet.</div>
            <div class="history-list">
              <div *ngFor="let h of returnHistory" class="history-item">
                <div>
                  <div class="request-title">{{ h.place || h.reason }}</div>
                  <div class="request-meta">{{ h.date | date:'dd MMM yyyy' }}</div>
                </div>
                <span [class]="'badge badge-' + h.status">{{ h.status | titlecase }}</span>
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
    .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    @media(max-width:900px) { .content-grid { grid-template-columns: 1fr; } }
    .card { background: var(--card); border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow); }
    .card-title { font-size: 16px; font-weight: 700; margin-bottom: 20px; }
    .gps-card { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .gps-icon { font-size: 48px; }
    .gps-card h3 { font-weight: 700; }
    .gps-card p { color: var(--muted); font-size: 14px; max-width: 280px; }
    .location-status { padding: 12px 20px; border-radius: 10px; background: var(--bg); font-size: 13px; font-weight: 500; }
    .location-status.located { background: rgba(16,185,129,.12); color: #059669; }
    .btn-secondary { background: transparent; border: 2px solid var(--primary); color: var(--primary); padding: 12px 28px; border-radius: 12px; font-weight: 600; cursor: pointer; }
    .btn-secondary:disabled { opacity: .6; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
    .form-control { width: 100%; padding: 11px 14px; border: 2px solid var(--border); border-radius: 10px; font-size: 14px; outline: none; transition: border-color .2s; background: var(--bg); color: var(--text); }
    .form-control:focus { border-color: var(--primary); }
    .btn-primary { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; border: none; padding: 13px 28px; border-radius: 12px; font-weight: 600; cursor: pointer; width: 100%; margin-top: 8px; }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
    .error-msg { color: var(--danger); font-size: 13px; margin-bottom: 10px; }
    .success-msg { color: var(--success); font-size: 13px; margin-bottom: 10px; }
    .mt { margin-top: 24px; }
    .history-list { display: flex; flex-direction: column; gap: 12px; }
    .history-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border: 1px solid var(--border); border-radius: 10px; }
    .request-title { font-weight: 600; font-size: 14px; }
    .request-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge-returned { background: rgba(16,185,129,.12); color: #059669; }
    .badge-completed { background: rgba(14,165,233,.12); color: #0284c7; }
    .badge-approved { background: rgba(245,158,11,.12); color: #d97706; }
    .empty-state { color: var(--muted); font-size: 14px; text-align: center; padding: 24px; }
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
    returnTime = '';
    pendingRecords: any[] = [];
    returnHistory: any[] = [];
    loading = false;
    msg = '';
    msgType = '';

    constructor(private http: HttpClient, private auth: AuthService) { }

    ngOnInit() { this.loadPendingRecords(); }

    get headers() {
        return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
    }

    getLocation() {
        if ('geolocation' in navigator) {
            this.locating = true;
            navigator.geolocation.getCurrentPosition(
                pos => {
                    this.lat = pos.coords.latitude;
                    this.lng = pos.coords.longitude;
                    this.located = true;
                    this.locating = false;
                },
                () => {
                    this.msg = 'Could not get location. Please enable GPS.';
                    this.msgType = 'error';
                    this.locating = false;
                },
                { enableHighAccuracy: true }
            );
        } else {
            this.msg = 'Geolocation is not supported by your browser.';
            this.msgType = 'error';
        }
    }

    loadPendingRecords() {
        const endpoint = this.type === 'outgoing' ? 'outgoing' : 'home-going';
        this.http.get<any>(`http://localhost:5000/api/student/${endpoint}`, this.headers).subscribe({
            next: r => {
                const all = r.outgoings || r.homeGoings || [];
                this.pendingRecords = all.filter((x: any) => x.status === 'approved' && !x.isReturned);
                this.returnHistory = all.filter((x: any) => x.status === 'returned' || x.status === 'completed');
            },
            error: () => { }
        });
    }

    markReturn() {
        if (!this.located || !this.selectedId) return;
        this.loading = true;
        const payload = {
            type: this.type,
            requestId: this.selectedId,
            latitude: this.lat,
            longitude: this.lng,
            returnDate: this.returnDate,
            returnTime: this.returnTime
        };
        this.http.post<any>('http://localhost:5000/api/student/return', payload, this.headers).subscribe({
            next: res => {
                this.msg = res.message || 'Return marked!';
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
