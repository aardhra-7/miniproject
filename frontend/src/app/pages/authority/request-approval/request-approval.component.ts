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
            <h1>Pending Approvals</h1>
            <p>Review and act on student requests for Home-going and Mess-cut.</p>
          </div>

          <div class="approval-grid">
            <!-- Mess Cut Card -->
            <div class="card approval-card">
              <div class="card-header">
                 <h3>🍽️ Mess Cut Requests ({{ messCuts.length }})</h3>
              </div>
              <div class="request-list">
                <div *ngIf="messCuts.length === 0" class="empty-list">No pending mess-cut requests.</div>
                <div *ngFor="let r of messCuts" class="req-item">
                   <div class="req-main">
                      <div class="student-info">
                         <span class="name">{{ r.student?.name }}</span>
                         <span class="meta">Room {{ r.student?.roomNumber }}</span>
                      </div>
                      <div class="date-range">{{ r.startDate | date:'dd MMM' }} — {{ r.endDate | date:'dd MMM yyyy' }}</div>
                      <p class="reason" *ngIf="r.reason">{{ r.reason }}</p>
                   </div>
                   <div class="req-actions">
                      <input class="form-control" [(ngModel)]="r._remarks" placeholder="Add remarks..." />
                      <div class="btn-group">
                         <button class="btn-approve" (click)="updateMessCut(r, 'approved')">Approve</button>
                         <button class="btn-reject" (click)="updateMessCut(r, 'rejected')">Reject</button>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <!-- Home Going Card -->
            <div class="card approval-card">
              <div class="card-header">
                 <h3>🏡 Home Going Requests ({{ homeGoings.length }})</h3>
              </div>
              <div class="request-list">
                <div *ngIf="homeGoings.length === 0" class="empty-list">No pending home-going requests.</div>
                <div *ngFor="let r of homeGoings" class="req-item">
                   <div class="req-main">
                      <div class="student-info">
                         <span class="name">{{ r.student?.name }}</span>
                         <span class="meta">Room {{ r.student?.roomNumber }}</span>
                      </div>
                      <div class="dest">📍 Leaving for: <strong>{{ r.place }}</strong></div>
                      <div class="date">Planned Date: {{ r.leaveDate | date:'fullDate' }}</div>
                   </div>
                   <div class="req-actions">
                      <input class="form-control" [(ngModel)]="r._remarks" placeholder="Add remarks..." />
                      <div class="btn-group">
                         <button class="btn-approve" (click)="updateHomeGoing(r, 'approved')">Approve</button>
                         <button class="btn-reject" (click)="updateHomeGoing(r, 'rejected')">Reject</button>
                      </div>
                   </div>
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
    .page-header { margin-bottom: 32px; }
    .page-header h1 { font-size: 24px; font-weight: 800; }
    
    .approval-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    @media(max-width: 1100px) { .approval-grid { grid-template-columns: 1fr; } }
    
    .card { background: var(--card); border-radius: 24px; padding: 28px; box-shadow: var(--shadow); height: fit-content; }
    .card-header h3 { font-size: 17px; font-weight: 700; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; }
    
    .request-list { display: flex; flex-direction: column; gap: 20px; }
    .req-item { padding: 20px; border: 1px solid var(--border); border-radius: 16px; background: var(--bg); }
    
    .student-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .student-info .name { font-weight: 800; font-size: 15px; }
    .student-info .meta { font-size: 11px; color: var(--muted); font-weight: 700; text-transform: uppercase; }
    
    .date-range, .dest, .date { font-size: 14px; font-weight: 600; margin-bottom: 8px; }
    .reason { font-size: 13px; color: var(--muted); background: rgba(0,0,0,.02); padding: 8px; border-radius: 8px; line-height: 1.5; }
    
    .req-actions { margin-top: 16px; display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--border); padding-top: 16px; }
    .form-control { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; font-size: 13px; outline: none; transition: border .2s; margin-top: 12px; }
    .form-control:focus { border-color: var(--primary); }
    
    .btn-group { display: flex; gap: 10px; }
    .btn-approve { flex: 1; background: #10b981; color: #fff; border: none; padding: 10px; border-radius: 10px; font-weight: 700; cursor: pointer; }
    .btn-reject { flex: 1; background: #ef4444; color: #fff; border: none; padding: 10px; border-radius: 10px; font-weight: 700; cursor: pointer; }
    
    .empty-list { text-align: center; color: var(--muted); font-size: 14px; padding: 40px; }
  `]
})
export class RequestApprovalComponent implements OnInit {
  homeGoings: any[] = [];
  messCuts: any[] = [];

  constructor(private http: HttpClient, private auth: AuthService) { }

  get headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
  }

  ngOnInit() { this.load(); }

  load() {
    this.http.get<any>('http://localhost:5000/api/authority/requests', this.headers).subscribe({
      next: r => {
        this.homeGoings = r.homeGoings || [];
        this.messCuts = r.messCuts || [];
      },
      error: () => { }
    });
  }

  updateHomeGoing(r: any, status: string) {
    this.http.put(`http://localhost:5000/api/authority/home-going/${r._id}`, { status, remarks: r._remarks || '' }, this.headers).subscribe({
      next: () => { this.load(); },
      error: () => alert('Action failed')
    });
  }

  updateMessCut(r: any, status: string) {
    this.http.put(`http://localhost:5000/api/authority/mess-cut/${r._id}`, { status, remarks: r._remarks || '' }, this.headers).subscribe({
      next: () => { this.load(); },
      error: () => alert('Action failed')
    });
  }
}
