import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home-going',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'student'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Home Going'"></app-topbar>
        <main class="page-content">

          <div class="page-header">
            <h1>Home Going</h1>
            <p>Inform the hostel about your home visit dates.</p>
          </div>

          <div class="content-grid">
            <div class="card">
              <h3 class="card-title">Register Home Visit</h3>
              <form [formGroup]="hgForm" (ngSubmit)="onSubmit()">
                <div class="form-row">
                  <div class="form-group">
                    <label>Leave Date</label>
                    <input type="date" class="form-control" formControlName="leaveDate" />
                  </div>
                  <div class="form-group">
                    <label>Return Date</label>
                    <input type="date" class="form-control" formControlName="returnDate" />
                  </div>
                </div>
                <div class="form-group">
                  <label>Time of Leaving</label>
                  <input type="time" class="form-control" formControlName="time" />
                </div>
                <div class="form-group">
                  <label>Place / Hometown</label>
                  <input class="form-control" formControlName="place" placeholder="e.g. Kochi, Ernakulam" />
                </div>
                <div class="form-group">
                  <label>Reason</label>
                  <textarea class="form-control" formControlName="reason" rows="3" placeholder="Festival, family function, medical..."></textarea>
                </div>
                <div *ngIf="msg" [class]="msgType === 'success' ? 'success-msg' : 'error-msg'">{{ msg }}</div>
                <button type="submit" class="btn-primary" [disabled]="hgForm.invalid || loading">
                  {{ loading ? 'Submitting...' : 'Submit →' }}
                </button>
              </form>
            </div>

            <div class="card">
              <h3 class="card-title">Home Going History</h3>
              <div *ngIf="records.length === 0" class="empty-state">No records found.</div>
              <div class="request-list">
                <div *ngFor="let r of records" class="request-item">
                  <div class="request-info">
                    <div class="request-title">{{ r.place }}</div>
                    <div class="request-meta">{{ r.date | date:'dd MMM yyyy' }} at {{ r.time }}</div>
                    <div class="request-meta">{{ r.reason }}</div>
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
    @media(max-width:900px) { .content-grid { grid-template-columns: 1fr; } }
    .card { background: var(--card); border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow); }
    .card-title { font-size: 16px; font-weight: 700; margin-bottom: 20px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
    .form-control { width: 100%; padding: 11px 14px; border: 2px solid var(--border); border-radius: 10px; font-size: 14px; outline: none; transition: border-color .2s; background: var(--bg); color: var(--text); }
    .form-control:focus { border-color: var(--primary); }
    .btn-primary { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; border: none; padding: 13px 28px; border-radius: 12px; font-weight: 600; cursor: pointer; width: 100%; margin-top: 8px; }
    .btn-primary:disabled { opacity: .7; cursor: not-allowed; }
    .error-msg { color: var(--danger); font-size: 13px; margin-bottom: 12px; }
    .success-msg { color: var(--success); font-size: 13px; margin-bottom: 12px; }
    .request-list { display: flex; flex-direction: column; gap: 12px; }
    .request-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border: 1px solid var(--border); border-radius: 12px; }
    .request-title { font-weight: 600; font-size: 14px; }
    .request-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge-approved { background: rgba(16,185,129,.12); color: #059669; }
    .badge-pending { background: rgba(245,158,11,.12); color: #d97706; }
    .badge-completed { background: rgba(14,165,233,.12); color: #0284c7; }
    .empty-state { color: var(--muted); font-size: 14px; text-align: center; padding: 32px; }
  `]
})
export class HomeGoingComponent implements OnInit {
  hgForm: FormGroup;
  records: any[] = [];
  loading = false;
  msg = '';
  msgType = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private auth: AuthService) {
    const today = new Date().toISOString().split('T')[0];
    this.hgForm = this.fb.group({
      leaveDate: [today, Validators.required],
      returnDate: ['', Validators.required],
      time: ['', Validators.required],
      place: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit() { this.loadRecords(); }

  get headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
  }

  loadRecords() {
    this.http.get<any>('http://localhost:5000/api/student/home-going', this.headers).subscribe({
      next: r => this.records = r.homeGoings || [],
      error: () => { }
    });
  }

  onSubmit() {
    if (this.hgForm.valid) {
      this.loading = true;
      this.http.post('http://localhost:5000/api/student/home-going', this.hgForm.value, this.headers).subscribe({
        next: () => {
          this.msg = 'Home going registered successfully!';
          this.msgType = 'success';
          this.hgForm.reset({ date: new Date().toISOString().split('T')[0] });
          this.loadRecords();
          this.loading = false;
        },
        error: (err) => {
          this.msg = err.error?.message || 'Failed.';
          this.msgType = 'error';
          this.loading = false;
        }
      });
    }
  }
}
