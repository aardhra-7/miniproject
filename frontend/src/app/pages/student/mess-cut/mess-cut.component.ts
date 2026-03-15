import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-mess-cut',
    standalone: true,
    imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
    template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'student'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Mess Cut Requests'"></app-topbar>
        <main class="page-content">

          <div class="page-header">
            <h1>Mess Cut Request</h1>
            <p>Request suspension of mess facilities for a specific period.</p>
          </div>

          <div class="content-grid">
            <div class="card">
              <h3 class="card-title">New Request</h3>
              <div class="form-container">
                <div class="form-row">
                  <div class="form-group">
                    <label>Start Date *</label>
                    <input type="date" class="form-control" [(ngModel)]="startDate" [min]="minDate" />
                    <span class="hint">Starting from tomorrow only</span>
                  </div>
                  <div class="form-group">
                    <label>End Date *</label>
                    <input type="date" class="form-control" [(ngModel)]="endDate" [min]="startDate || minDate" />
                  </div>
                </div>
                <div class="form-group">
                  <label>Reason (Optional)</label>
                  <textarea class="form-control" [(ngModel)]="reason" rows="3" placeholder="Family event, holiday etc."></textarea>
                </div>

                <div *ngIf="msg" [class]="msgType === 'success' ? 'msg-success' : 'msg-error'">
                  {{ msg }}
                </div>

                <button class="btn-primary" (click)="submitRequest()" [disabled]="!startDate || !endDate || loading">
                  {{ loading ? 'Submitting...' : 'Submit Request →' }}
                </button>
              </div>
              <div class="policy-note">
                <p>⚠️ <strong>Policy:</strong> Mess cut must be applied for at least the minimum allowed days (as set by hostel admin). All requests go to Authority for approval.</p>
              </div>
            </div>

            <div class="card">
              <h3 class="card-title">Mess Cut History</h3>
              <div *ngIf="records.length === 0" class="empty-state">No requests found.</div>
              <div class="history-list">
                <div *ngFor="let r of records" class="history-item">
                  <div class="item-main">
                    <div class="date-range">
                      {{ r.startDate | date:'dd MMM' }} — {{ r.endDate | date:'dd MMM yyyy' }}
                    </div>
                    <div class="reason">{{ r.reason || 'No reason specified' }}</div>
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
    .page-header { margin-bottom: 28px; }
    .page-header h1 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
    .page-header p { color: var(--muted); font-size: 14px; }

    .content-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; }
    @media(max-width: 1000px) { .content-grid { grid-template-columns: 1fr; } }

    .card { background: var(--card); border-radius: 20px; padding: 28px; box-shadow: var(--shadow); }
    .card-title { font-size: 16px; font-weight: 700; margin-bottom: 24px; }

    .form-container { display: flex; flex-direction: column; gap: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px; }
    .form-control { width: 100%; padding: 12px 16px; border: 2px solid var(--border); border-radius: 12px; font-size: 14px; outline: none; background: var(--bg); color: var(--text); }
    .form-control:focus { border-color: var(--primary); }
    .hint { font-size: 11px; color: var(--muted); margin-top: 4px; display: block; }

    .btn-primary { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; border: none; padding: 14px; border-radius: 14px; font-weight: 700; font-size: 14px; cursor: pointer; margin-top: 8px; }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }

    .msg-success { color: #059669; background: #dcfce7; padding: 12px; border-radius: 10px; font-size: 13px; font-weight: 600; }
    .msg-error { color: #dc2626; background: #fee2e2; padding: 12px; border-radius: 10px; font-size: 13px; font-weight: 600; }

    .policy-note { margin-top: 24px; padding: 16px; background: var(--bg); border-radius: 12px; font-size: 12px; color: var(--muted); border: 1px dashed var(--border); }

    .history-list { display: flex; flex-direction: column; gap: 12px; }
    .history-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid var(--border); border-radius: 14px; }
    .date-range { font-weight: 700; font-size: 14px; margin-bottom: 4px; }
    .reason { font-size: 12px; color: var(--muted); }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
    .badge-approved { background: rgba(16, 185, 129, .12); color: #059669; }
    .badge-pending { background: rgba(245, 158, 11, .12); color: #d97706; }
    .badge-rejected { background: rgba(239, 68, 68, .12); color: #dc2626; }
    .empty-state { text-align: center; color: var(--muted); padding: 40px; font-size: 14px; }
  `]
})
export class MessCutComponent implements OnInit {
    startDate = '';
    endDate = '';
    reason = '';
    minDate = '';
    loading = false;
    msg = '';
    msgType = '';
    records: any[] = [];

    constructor(private http: HttpClient, private auth: AuthService) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.minDate = tomorrow.toISOString().split('T')[0];
    }

    ngOnInit() {
        this.loadRecords();
    }

    get headers() {
        return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
    }

    loadRecords() {
        this.http.get<any>('http://localhost:5000/api/student/mess-cut', this.headers).subscribe({
            next: res => this.records = res.messCuts || [],
            error: () => { }
        });
    }

    submitRequest() {
        if (!this.startDate || !this.endDate) return;
        this.loading = true;
        this.msg = '';

        this.http.post('http://localhost:5000/api/student/mess-cut', {
            startDate: this.startDate,
            endDate: this.endDate,
            reason: this.reason
        }, this.headers).subscribe({
            next: (res: any) => {
                this.msg = res.message || 'Request submitted successfully!';
                this.msgType = 'success';
                this.loading = false;
                this.startDate = '';
                this.endDate = '';
                this.reason = '';
                this.loadRecords();
            },
            error: err => {
                this.msg = err.error?.message || 'Submission failed.';
                this.msgType = 'error';
                this.loading = false;
            }
        });
    }
}
