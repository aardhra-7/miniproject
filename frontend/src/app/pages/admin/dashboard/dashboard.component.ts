import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, SidebarComponent, TopbarComponent],
    template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'admin'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Admin Dashboard'"></app-topbar>
        <main class="page-content">
          <div class="dashboard-header">
            <h1>System Overview</h1>
            <p>Real-time statistics and summary of hostel activities.</p>
          </div>

          <div class="stats-grid">
            <!-- Weekly Outgoing Summary -->
            <div class="card summary-card primary">
              <div class="card-header">
                <h3>Weekly Outgoing Summary</h3>
                <span class="badge">Last 7 Days</span>
              </div>
              <div class="stats-row">
                <div class="stat-item">
                  <span class="label">Total Requests</span>
                  <span class="value">{{ stats?.weekly?.totalOutgoing || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">Approved</span>
                  <span class="value">{{ stats?.weekly?.approvedOutgoing || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">Returned</span>
                  <span class="value">{{ stats?.weekly?.returnedStudents || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Request Distribution Status -->
            <div class="card summary-card accent">
              <div class="card-header">
                <h3>Request Distribution</h3>
                <span class="badge">All Time</span>
              </div>
              <div class="stats-row">
                <div class="stat-item">
                  <span class="label">Outgoing</span>
                  <span class="value">{{ stats?.distribution?.outgoingCount || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">Home-going</span>
                  <span class="value">{{ stats?.distribution?.homegoingCount || 0 }}</span>
                </div>
                <div class="stat-item highlight">
                  <span class="label">Pending</span>
                  <span class="value">{{ stats?.distribution?.pendingApprovals || 0 }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Return Tracking Preview -->
          <div class="card mt-24">
            <div class="card-header border-b">
              <h3>Live Return Tracking</h3>
              <button class="btn-text">View All</button>
            </div>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Room</th>
                    <th>Request Type</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of returnTracking">
                    <td>{{ item.student?.name || 'Unknown' }}</td>
                    <td>{{ item.student?.roomNumber || '—' }}</td>
                    <td>Outgoing</td>
                    <td>
                      <span [class]="'badge ' + (item.returnStatus === 'returned' ? 'success' : 'warning')">
                        {{ item.returnStatus === 'returned' ? 'Returned' : 'Away' }}
                      </span>
                    </td>
                    <td>{{ item.returnTime ? (item.returnTime | date:'shortTime') : (item.timeLeaving) }}</td>
                  </tr>
                  <tr *ngIf="returnTracking.length === 0">
                    <td colspan="5" class="empty-td">No active tracking data.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
    styles: [`
    .dashboard-header { margin-bottom: 32px; }
    .dashboard-header h1 { font-size: 24px; font-weight: 800; color: var(--text); margin-bottom: 4px; }
    .dashboard-header p { color: var(--muted); font-size: 15px; }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px; }
    .summary-card { padding: 24px; position: relative; overflow: hidden; }
    .summary-card.primary { background: linear-gradient(135deg, #1e40af, #3b82f6); color: #fff; }
    .summary-card.accent { background: linear-gradient(135deg, #7c3aed, #c026d3); color: #fff; }
    
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .card-header h3 { font-size: 16px; font-weight: 700; }
    .badge { background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge.success { background: #dcfce7; color: #166534; }
    .badge.warning { background: #fef9c3; color: #854d0e; }

    .stats-row { display: flex; justify-content: space-between; gap: 16px; }
    .stat-item { display: flex; flex-direction: column; }
    .stat-item .label { font-size: 12px; opacity: 0.8; margin-bottom: 4px; }
    .stat-item .value { font-size: 24px; font-weight: 800; }
    .stat-item.highlight .value { color: #fef08a; }

    .mt-24 { margin-top: 24px; }
    .border-b { border-bottom: 1px solid var(--border); padding-bottom: 16px; margin-bottom: 0; }
    .table-responsive { width: 100%; overflow-x: auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { padding: 12px 20px; text-align: left; font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; }
    .table td { padding: 16px 20px; border-top: 1px solid var(--border); font-size: 14px; color: var(--text); }
    .btn-text { background: none; border: none; color: var(--primary); font-weight: 600; cursor: pointer; font-size: 13px; }
    .empty-td { text-align: center; color: var(--muted); padding: 40px !important; }
  `]
})
export class AdminDashboardComponent implements OnInit {
    stats: any;
    returnTracking: any[] = [];
    isLoading = true;

    constructor(private http: HttpClient, private auth: AuthService) { }

    ngOnInit() {
        this.loadStats();
        this.loadReturnTracking();
    }

    get headers() {
        return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
    }

    loadStats() {
        this.http.get<any>('http://localhost:5000/api/admin/dashboard-stats', this.headers).subscribe({
            next: (res) => {
                this.stats = res.stats;
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    loadReturnTracking() {
        this.http.get<any>('http://localhost:5000/api/admin/return-tracking', this.headers).subscribe({
            next: (res) => {
                this.returnTracking = (res.outgoings || []).slice(0, 5);
            },
            error: () => { }
        });
    }
}
