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
    <div class="dashboard-layout animate-fade-in">
      <app-sidebar [role]="'admin'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'System Dashboard'"></app-topbar>
        <main class="page-content">
          <div class="dashboard-header">
            <h1> Welcome Back </h1>
            <p>Monitor your hostel's activity at a glance.</p>
          </div>

          <div class="stats-grid">
            <!-- Today's Activity Card -->
            <div class="dashboard-card primary-gradient">
              <div class="card-header-row">
                <h3><i class="bi bi-activity"></i> Today's Summary</h3>
                <span class="live-indicator">
                  <span class="ring"></span>
                  Live
                </span>
              </div>
              <div class="stats-box">
                <div class="stat-node">
                  <div class="n-label">Outgoings</div>
                  <div class="n-value">{{ stats?.today?.todayOutgoings || 0 }}</div>
                </div>
                <div class="stat-node">
                  <div class="n-label">Home Goings</div>
                  <div class="n-value">{{ stats?.today?.todayHomeGoings || 0 }}</div>
                </div>
                <div class="stat-node">
                  <div class="n-label">Mess Cuts</div>
                  <div class="n-value">{{ stats?.today?.activeMessCuts || 0 }}</div>
                </div>
              </div>
            </div>

            <!-- Action Required Card -->
            <div class="dashboard-card accent-gradient">
              <div class="card-header-row">
                <h3><i class="bi bi-clock-history"></i> Pending Tasks</h3>
                <span class="action-badge">ACTION NEEDED</span>
              </div>
              <div class="stats-box">
                <div class="stat-node">
                  <div class="n-label">Mess Requests</div>
                  <div class="n-value">{{ stats?.pending?.pendingMessCuts || 0 }}</div>
                </div>
                <div class="stat-node">
                  <div class="n-label">Home Leaves</div>
                  <div class="n-value">{{ stats?.pending?.pendingHomeGoings || 0 }}</div>
                </div>
                <div class="stat-node highlight">
                  <div class="n-label">Total Waiting</div>
                  <div class="n-value">{{ stats?.pending?.totalPending || 0 }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tracking Table -->
          <div class="dashboard-card mt-30">
            <div class="table-header">
              <div class="th-left">
                <h3>Live Attendance Tracking</h3>
                <p>Real-time location and return status monitoring.</p>
              </div>
              <button class="secondary-btn">View All History</button>
            </div>
            
            <div class="table-responsive">
              <table class="modern-table">
                <thead>
                  <tr>
                    <th>Student Details</th>
                    <th>Room</th>
                    <th>Log Type</th>
                    <th>Status</th>
                    <th>Recorded Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of returnTracking">
                    <td>
                      <div class="student-info">
                        <div class="s-avatar">{{ item.student?.name?.substring(0,1) }}</div>
                        <div class="s-details">
                          <span class="s-name">{{ item.student?.name || 'Unknown User' }}</span>
                          <span class="s-id">{{ item.student?.userId || 'N/A' }}</span>
                        </div>
                      </div>
                    </td>
                    <td><span class="room-pill">{{ item.student?.roomNumber || '—' }}</span></td>
                    <td><span class="log-type">Outgoing</span></td>
                    <td>
                      <span class="status-badge" [class.success]="item.returnStatus === 'returned'" [class.warning]="item.returnStatus !== 'returned'">
                        <i class="bi" [class.bi-check-circle-fill]="item.returnStatus === 'returned'" [class.bi-geo-alt-fill]="item.returnStatus !== 'returned'"></i>
                        {{ item.returnStatus === 'returned' ? 'Returned' : 'Away' }}
                      </span>
                    </td>
                    <td>
                      <div class="time-col">
                        <i class="bi bi-clock"></i>
                        {{ item.returnTime ? (item.returnTime | date:'shortTime') : (item.timeLeaving) }}
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="returnTracking.length === 0">
                    <td colspan="5" class="empty-state">
                      <i class="bi bi-inbox"></i>
                      <p>No active movements found in the last 24 hours.</p>
                    </td>
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
    .dashboard-header { margin-bottom: 40px; }
    .dashboard-header h1 { font-size: 28px; margin-bottom: 6px; }
    .dashboard-header p { color: var(--text-light); font-size: 15px; }

    .stats-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); 
      gap: 24px; 
    }

    .primary-gradient { 
      background: linear-gradient(135deg, var(--primary), var(--primary-dark)); 
      color: #fff; 
      border: none;
    }
    
    .accent-gradient { 
      background: linear-gradient(135deg, #10b981, #059669); 
      color: #fff;
      border: none;
    }

    .card-header-row { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 32px; 
    }
    
    .card-header-row h3 { 
      font-size: 16px; 
      font-weight: 700; 
      display: flex; 
      align-items: center; 
      gap: 10px;
      opacity: 0.9;
    }

    .live-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(255,255,255,0.15);
      border-radius: 50px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .ring {
      width: 8px;
      height: 8px;
      background: #4ade80;
      border-radius: 50%;
      box-shadow: 0 0 0 rgba(74, 222, 128, 0.4);
      animation: pulse 2s infinite;
    }

    .action-badge {
      background: rgba(255,255,255,0.2);
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
      100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
    }

    .stats-box { 
      display: flex; 
      justify-content: space-between; 
      gap: 20px; 
    }
    
    .stat-node { display: flex; flex-direction: column; }
    .stat-node .n-label { font-size: 12px; opacity: 0.8; margin-bottom: 8px; font-weight: 500; }
    .stat-node .n-value { font-size: 32px; font-weight: 800; font-family: 'Poppins', sans-serif; }
    .stat-node.highlight .n-value { color: #fef08a; }

    .mt-30 { margin-top: 30px; }
    
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .th-left h3 { font-size: 18px; margin-bottom: 4px; }
    .th-left p { font-size: 13px; color: var(--text-light); }

    .modern-table { width: 100%; border-collapse: collapse; }
    .modern-table th { 
      text-align: left; 
      padding: 12px 16px; 
      font-size: 12px; 
      color: var(--text-light); 
      text-transform: uppercase; 
      letter-spacing: 1px; 
      font-weight: 700;
    }
    
    .modern-table td { padding: 16px; border-bottom: 1px solid #f8f9fa; }

    .student-info { display: flex; align-items: center; gap: 12px; }
    .s-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--primary-light);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
    .s-details { display: flex; flex-direction: column; }
    .s-name { font-weight: 600; font-size: 14px; color: var(--text-dark); }
    .s-id { font-size: 11px; color: var(--text-light); }

    .room-pill { 
      background: #f3f4f6; 
      padding: 4px 10px; 
      border-radius: 6px; 
      font-size: 12px; 
      font-weight: 700; 
      color: var(--text-dark);
    }
    
    .log-type { font-size: 13px; color: var(--text-light); font-weight: 500; }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
    }
    .status-badge.success { background: var(--success-bg); color: var(--success); }
    .status-badge.warning { background: var(--warning-bg); color: #854d0e; }

    .time-col { font-size: 13px; color: var(--text-light); display: flex; align-items: center; gap: 6px; }

    .empty-state { text-align: center; padding: 60px !important; color: var(--text-light); }
    .empty-state i { font-size: 40px; opacity: 0.2; margin-bottom: 12px; display: block; }
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
