import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-outgoing',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'student'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Outgoing Marking'"></app-topbar>
        <main class="page-content">

          <div class="page-header">
            <h1>Mark Outgoing</h1>
            <p>Directly record your departure from the hostel. No approval required.</p>
          </div>

          <div class="content-grid">
            <!-- Mark Form -->
            <div class="card">
              <h3 class="card-title">New Outgoing</h3>
              <div class="form-container">
                <div class="form-group">
                  <label>Date</label>
                  <input type="date" class="form-control" [(ngModel)]="date" />
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Time of Leaving</label>
                    <input type="time" class="form-control" [(ngModel)]="timeLeaving" />
                  </div>
                  <div class="form-group">
                    <label>Destination / Place</label>
                    <input class="form-control" [(ngModel)]="place" placeholder=" " />
                  </div>
                </div>

                <div *ngIf="msg" [class]="msgType === 'success' ? 'msg-success' : 'msg-error'">{{ msg }}</div>

                <button class="btn-primary" (click)="submitMarking()" [disabled]="!date || !timeLeaving || !place || loading">
                  {{ loading ? 'Recording...' : ' Mark Outgoing' }}
                </button>
              </div>
            </div>

            <!-- Active & Recent -->
            <div class="card">
              <h3 class="card-title">My Outgoing History</h3>
              <div *ngIf="records.length === 0" class="empty-state">No records found.</div>
              <div class="history-list">
                <div *ngFor="let r of records" class="history-item" [class.item-active]="r.status === 'active'">
                  <div class="item-main">
                    <div class="item-title">{{ r.place }}</div>
                    <div class="item-meta">{{ r.date | date:'dd MMM yyyy' }} at {{ r.timeLeaving }}</div>
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

    .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    @media(max-width: 900px) { .content-grid { grid-template-columns: 1fr; } }
    
    .card { background: var(--card); border-radius: 20px; padding: 28px; box-shadow: var(--shadow); }
    .card-title { font-size: 16px; font-weight: 700; margin-bottom: 24px; }

    .form-container { display: flex; flex-direction: column; gap: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px; }
    .form-control { width: 100%; padding: 12px 16px; border: 2px solid var(--border); border-radius: 12px; font-size: 14px; outline: none; background: var(--bg); color: var(--text); }
    .form-control:focus { border-color: var(--primary); }

    .btn-primary { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; border: none; padding: 14px; border-radius: 14px; font-weight: 700; font-size: 14px; cursor: pointer; margin-top: 8px; transition: transform .2s; }
    .btn-primary:active { transform: scale(.98); }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }

    .msg-success { color: #059669; background: #dcfce7; padding: 12px; border-radius: 10px; font-size: 13px; font-weight: 600; }
    .msg-error { color: #dc2626; background: #fee2e2; padding: 12px; border-radius: 10px; font-size: 13px; font-weight: 600; }

    .history-list { display: flex; flex-direction: column; gap: 12px; }
    .history-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid var(--border); border-radius: 14px; }
    .item-active { border-color: var(--primary); background: rgba(14, 165, 233, .04); }
    .item-title { font-weight: 700; font-size: 14px; margin-bottom: 2px; }
    .item-meta { font-size: 12px; color: var(--muted); }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
    .badge-active { background: rgba(14, 165, 233, .12); color: #0284c7; }
    .badge-returned { background: rgba(16, 185, 129, .12); color: #059669; }
    .empty-state { text-align: center; color: var(--muted); padding: 40px; font-size: 14px; }
  `]
})
export class OutgoingComponent implements OnInit {
  date = new Date().toISOString().split('T')[0];
  timeLeaving = '';
  place = '';
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
    this.http.get<any>('http://localhost:5000/api/student/outgoing', this.headers).subscribe({
      next: res => this.records = res.outgoings || [],
      error: () => { }
    });
  }

  submitMarking() {
    if (!this.date || !this.timeLeaving || !this.place) return;
    this.loading = true;
    this.msg = '';

    this.http.post('http://localhost:5000/api/student/outgoing', {
      date: this.date,
      timeLeaving: this.timeLeaving,
      place: this.place
    }, this.headers).subscribe({
      next: (res: any) => {
        this.msg = res.message || 'Outgoing recorded!';
        this.msgType = 'success';
        this.loading = false;
        this.timeLeaving = '';
        this.place = '';
        this.loadRecords();
      },
      error: err => {
        this.msg = err.error?.message || 'Failed to record.';
        this.msgType = 'error';
        this.loading = false;
      }
    });
  }
}
