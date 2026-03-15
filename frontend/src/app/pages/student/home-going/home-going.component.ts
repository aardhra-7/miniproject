import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home-going',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'student'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Home Going'"></app-topbar>
        <main class="page-content">

          <div class="page-header">
            <h1>Home Going Management</h1>
            <p>Request permission for home visits or record your departure when leaving.</p>
          </div>

          <div class="tab-nav">
             <button [class.active]="activeTab === 'request'" (click)="activeTab = 'request'"> Home-going Request</button>
             <button [class.active]="activeTab === 'mark'" (click)="activeTab = 'mark'"> Mark Home-going</button>
          </div>

          <div class="content-grid">
            <!-- Form Section -->
            <div class="card">
               <div *ngIf="activeTab === 'request'">
                  <h3 class="card-title">New Home-going Request</h3>
                  <p class="section-desc">Submit this for future home visits. Requires Authority approval.</p>
                  <div class="form-container">
                    <div class="form-group">
                      <label>Proposed Leave Date *</label>
                      <input type="date" class="form-control" [(ngModel)]="leaveDate" />
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label>Preferred Time</label>
                        <input type="time" class="form-control" [(ngModel)]="time" />
                      </div>
                      <div class="form-group">
                        <label>Place / Hometown *</label>
                        <input class="form-control" [(ngModel)]="place" placeholder="e.g. Kochi" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label>Reason *</label>
                      <textarea class="form-control" [(ngModel)]="reason" rows="2" placeholder="Going for family event..."></textarea>
                    </div>
                    <button class="btn-primary" (click)="submitRequest()" [disabled]="!leaveDate || !place || loading">
                      {{ loading ? 'Submitting...' : 'Send Request →' }}
                    </button>
                  </div>
               </div>

               <div *ngIf="activeTab === 'mark'">
                  <h3 class="card-title">Record Departure</h3>
                  <p class="section-desc">Use this when you are actually leaving the hostel today.</p>
                  <div class="form-container">
                    <div class="form-group">
                      <label>Departure Date</label>
                      <input type="date" class="form-control" [(ngModel)]="markDate" />
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label>Departure Time</label>
                        <input type="time" class="form-control" [(ngModel)]="markTime" />
                      </div>
                      <div class="form-group">
                        <label>Place / Hometown</label>
                        <input class="form-control" [(ngModel)]="markPlace" placeholder="e.g. Kochi" />
                      </div>
                    </div>
                    <button class="btn-primary btn-record" (click)="submitMarking()" [disabled]="!markDate || !markPlace || loading">
                      {{ loading ? 'Recording...' : ' Mark Home-going Now' }}
                    </button>
                  </div>
               </div>

               <div *ngIf="msg" [class]="msgType === 'success' ? 'msg-success' : 'msg-error'" class="mt">
                  {{ msg }}
               </div>
            </div>

            <!-- History Section -->
            <div class="card">
              <h3 class="card-title">Home Going History</h3>
              <div *ngIf="records.length === 0" class="empty-state">No records found.</div>
              <div class="history-list">
                <div *ngFor="let r of records" class="history-item" [class.item-active]="r.status === 'active' || r.status === 'approved'">
                  <div class="item-main">
                    <div class="item-title">{{ r.place }}</div>
                    <div class="item-meta">{{ r.leaveDate | date:'dd MMM yyyy' }} at {{ r.time }}</div>
                    <div class="item-reason" *ngIf="r.reason">{{ r.reason }}</div>
                    <div class="item-meta type-badge">{{ r.recordingType === 'request' ? 'Request' : 'Direct Marking' }}</div>
                  </div>
                  <span [class]="'badge badge-' + r.status">{{ r.status | titlecase }}</span>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: contents; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
    .page-header p { color: var(--muted); font-size: 14px; }

    .tab-nav { display: flex; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 12px; }
    .tab-nav button { background: none; border: none; padding: 8px 16px; font-size: 14px; font-weight: 700; color: var(--muted); cursor: pointer; border-radius: 10px; transition: all .2s; }
    .tab-nav button.active { background: var(--primary); color: #fff; }

    .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    @media(max-width: 900px) { .content-grid { grid-template-columns: 1fr; } }
    
    .card { background: var(--card); border-radius: 20px; padding: 28px; box-shadow: var(--shadow); height: fit-content; }
    .card-title { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
    .section-desc { font-size: 13px; color: var(--muted); margin-bottom: 24px; }

    .form-container { display: flex; flex-direction: column; gap: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px; }
    .form-control { width: 100%; padding: 12px 16px; border: 2px solid var(--border); border-radius: 12px; font-size: 14px; outline: none; background: var(--bg); color: var(--text); }
    .form-control:focus { border-color: var(--primary); }

    .btn-primary { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; border: none; padding: 14px; border-radius: 14px; font-weight: 700; font-size: 14px; cursor: pointer; margin-top: 8px; transition: transform .2s; }
    .btn-primary:active { transform: scale(.98); }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
    .btn-record { background: linear-gradient(135deg, var(--accent), #7c3aed); }

    .msg-success { color: #059669; background: #dcfce7; padding: 12px; border-radius: 10px; font-size: 13px; font-weight: 600; }
    .msg-error { color: #dc2626; background: #fee2e2; padding: 12px; border-radius: 10px; font-size: 13px; font-weight: 600; }
    .mt { margin-top: 16px; }

    .history-list { display: flex; flex-direction: column; gap: 12px; }
    .history-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid var(--border); border-radius: 14px; }
    .item-active { border-color: var(--primary); background: rgba(14, 165, 233, .04); }
    .item-title { font-weight: 700; font-size: 14px; margin-bottom: 2px; }
    .item-meta { font-size: 12px; color: var(--muted); }
    .item-reason { font-size: 12px; color: var(--text); background: rgba(0,0,0,.03); padding: 4px 8px; border-radius: 6px; margin: 4px 0; }
    .type-badge { font-weight: 700; color: var(--primary); font-size: 10px; text-transform: uppercase; margin-top: 4px; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
    .badge-approved { background: rgba(16, 185, 129, .12); color: #059669; }
    .badge-pending { background: rgba(245, 158, 11, .12); color: #d97706; }
    .badge-active { background: rgba(14, 165, 233, .12); color: #0284c7; }
    .badge-returned { background: rgba(16, 185, 129, .12); color: #059669; }
    .empty-state { text-align: center; color: var(--muted); padding: 40px; font-size: 14px; }
  `]
})
export class HomeGoingComponent implements OnInit {
  activeTab = 'request';

  // Request Form
  leaveDate = '';
  time = '';
  place = '';
  reason = '';

  // Mark Form
  markDate = new Date().toISOString().split('T')[0];
  markTime = '';
  markPlace = '';

  loading = false;
  msg = '';
  msgType = '';
  records: any[] = [];

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.loadRecords();
  }

  get headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
  }

  loadRecords() {
    this.http.get<any>('http://localhost:5000/api/student/home-going', this.headers).subscribe({
      next: res => this.records = res.homeGoings || [],
      error: () => { }
    });
  }

  submitRequest() {
    if (!this.leaveDate || !this.place) return;
    this.loading = true;
    this.msg = '';

    this.http.post('http://localhost:5000/api/student/home-going/request', {
      leaveDate: this.leaveDate,
      time: this.time,
      place: this.place,
      reason: this.reason
    }, this.headers).subscribe({
      next: (res: any) => {
        this.msg = res.message || 'Request submitted!';
        this.msgType = 'success';
        this.loading = false;
        this.clearForms();
        this.loadRecords();
      },
      error: err => {
        this.msg = err.error?.message || 'Failed.';
        this.msgType = 'error';
        this.loading = false;
      }
    });
  }

  submitMarking() {
    if (!this.markDate || !this.markPlace) return;
    this.loading = true;
    this.msg = '';

    this.http.post('http://localhost:5000/api/student/home-going/mark', {
      leaveDate: this.markDate,
      time: this.markTime,
      place: this.markPlace
    }, this.headers).subscribe({
      next: (res: any) => {
        this.msg = res.message || 'Home-going marked!';
        this.msgType = 'success';
        this.loading = false;
        this.clearForms();
        this.loadRecords();
      },
      error: err => {
        this.msg = err.error?.message || 'Failed.';
        this.msgType = 'error';
        this.loading = false;
      }
    });
  }

  clearForms() {
    this.leaveDate = '';
    this.time = '';
    this.place = '';
    this.reason = '';
    this.markPlace = '';
  }
}
