import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-request-approval',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'authority'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Request Approvals'"></app-topbar>
        <main class="page-content">

          <div class="page-header">
            <h1>Pending Requests</h1>
            <p>Review and approve or reject student requests.</p>
          </div>

          <!-- Tabs -->
          <div class="tabs">
            <button [class.active]="activeTab === 'outgoing'" (click)="activeTab='outgoing'; load()">
              Outgoing ({{ outgoings.length }})
            </button>
            <button [class.active]="activeTab === 'homegoing'" (click)="activeTab='homegoing'; load()">
              Home Going ({{ homeGoings.length }})
            </button>
          </div>

          <!-- Outgoing Tab -->
          <div *ngIf="activeTab === 'outgoing'">
            <div *ngIf="outgoings.length === 0" class="empty-state">No pending outgoing requests.</div>
            <div *ngFor="let r of outgoings" class="request-card">
              <div class="req-info">
                <div class="req-name">{{ r.student?.name || r.studentName }}</div>
                <div class="req-meta">Room {{ r.student?.roomNumber || r.roomNumber || '—' }} &nbsp;|&nbsp; {{ r.date | date:'dd MMM yyyy' }}</div>
                <div class="req-meta">Leave: {{ r.timeLeaving }} | Expected Return: {{ r.expectedReturnTime }}</div>
                <div class="req-reason">Reason: {{ r.reason }}</div>
                <div class="req-place" *ngIf="r.place">📍 {{ r.place }}</div>
              </div>
              <div class="action-group" *ngIf="r.status === 'pending'">
                <input class="form-control" [(ngModel)]="r._remarks" placeholder="Remarks (optional)" />
                <div class="btn-group">
                  <button class="btn-approve" (click)="approve(r, 'outgoing')">Approve</button>
                  <button class="btn-reject" (click)="reject(r, 'outgoing')">Reject</button>
                </div>
              </div>
              <span *ngIf="r.status !== 'pending'" [class]="'badge badge-' + r.status">
                {{ r.status | titlecase }}
              </span>
            </div>
          </div>

          <!-- Home Going Tab -->
          <div *ngIf="activeTab === 'homegoing'">
            <div *ngIf="homeGoings.length === 0" class="empty-state">No pending home-going requests.</div>
            <div *ngFor="let r of homeGoings" class="request-card">
              <div class="req-info">
                <div class="req-name">{{ r.student?.name || r.studentName }}</div>
                <div class="req-meta">Room {{ r.student?.roomNumber || r.roomNumber || '—' }} &nbsp;|&nbsp; {{ r.date | date:'dd MMM yyyy' }}</div>
                <div class="req-place">📍 {{ r.place }}</div>
                <div class="req-reason">Reason: {{ r.reason }}</div>
              </div>
              <div class="action-group" *ngIf="r.status === 'pending'">
                <input class="form-control" [(ngModel)]="r._remarks" placeholder="Remarks (optional)" />
                <div class="btn-group">
                  <button class="btn-approve" (click)="approve(r, 'homegoing')">Approve</button>
                  <button class="btn-reject" (click)="reject(r, 'homegoing')">Reject</button>
                </div>
              </div>
              <span *ngIf="r.status !== 'pending'" [class]="'badge badge-' + r.status">
                {{ r.status | titlecase }}
              </span>
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
    .tabs { display: flex; gap: 8px; margin-bottom: 24px; }
    .tabs button { padding: 10px 20px; border: 2px solid var(--border); background: transparent; border-radius: 10px; cursor: pointer; font-weight: 600; color: var(--muted); transition: all .2s; }
    .tabs button.active { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
    .request-card { background: var(--card); border-radius: var(--radius); padding: 20px 24px; box-shadow: var(--shadow); margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
    .req-name { font-weight: 700; font-size: 15px; margin-bottom: 4px; }
    .req-meta { font-size: 12px; color: var(--muted); }
    .req-reason { font-size: 13px; margin-top: 6px; }
    .req-place { font-size: 12px; color: var(--primary); margin-top: 4px; }
    .action-group { display: flex; flex-direction: column; gap: 8px; min-width: 200px; }
    .form-control { width: 100%; padding: 9px 12px; border: 2px solid var(--border); border-radius: 8px; font-size: 13px; outline: none; background: var(--bg); color: var(--text); }
    .btn-group { display: flex; gap: 8px; }
    .btn-approve { flex: 1; background: rgba(16,185,129,.12); color: #059669; border: none; padding: 9px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-reject { flex: 1; background: rgba(239,68,68,.12); color: #dc2626; border: none; padding: 9px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .badge { padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; }
    .badge-approved { background: rgba(16,185,129,.12); color: #059669; }
    .badge-rejected { background: rgba(239,68,68,.12); color: #dc2626; }
    .empty-state { color: var(--muted); font-size: 14px; text-align: center; padding: 40px; }
  `]
})
export class RequestApprovalComponent implements OnInit {
  activeTab = 'outgoing';
  outgoings: any[] = [];
  homeGoings: any[] = [];

  constructor(private http: HttpClient, private auth: AuthService) { }

  get headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
  }

  ngOnInit() { this.load(); }

  load() {
    this.http.get<any>('http://localhost:5000/api/authority/requests', this.headers).subscribe({
      next: r => {
        this.outgoings = r.outgoings || [];
        this.homeGoings = r.homeGoings || [];
      },
      error: () => { }
    });
  }

  approve(r: any, type: string) {
    const url = type === 'outgoing'
      ? `http://localhost:5000/api/authority/outgoing/${r._id}`
      : `http://localhost:5000/api/authority/home-going/${r._id}`;
    this.http.put(url, { status: 'approved', remarks: r._remarks || '' }, this.headers).subscribe({
      next: () => { r.status = 'approved'; },
      error: () => { }
    });
  }

  reject(r: any, type: string) {
    const url = type === 'outgoing'
      ? `http://localhost:5000/api/authority/outgoing/${r._id}`
      : `http://localhost:5000/api/authority/home-going/${r._id}`;
    this.http.put(url, { status: 'rejected', remarks: r._remarks || '' }, this.headers).subscribe({
      next: () => { r.status = 'rejected'; },
      error: () => { }
    });
  }
}
