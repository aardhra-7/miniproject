import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopbarComponent, RouterModule],
  template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'student'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Student Dashboard'"></app-topbar>
        <main class="page-content">
          
          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-icon green">📊</div>
              <div>
                <div class="stat-value">{{ attendancePercent }}%</div>
                <div class="stat-label">Attendance</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon orange">🍽️</div>
              <div>
                <div class="stat-value">{{ messCutDays }}</div>
                <div class="stat-label">Mess Cut Days</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon blue">🚶</div>
              <div>
                <div class="stat-value">{{ activeOutgoings }}</div>
                <div class="stat-label">Active Outgoings</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon purple">🏡</div>
              <div>
                <div class="stat-value">{{ pendingHomeGoings }}</div>
                <div class="stat-label">Pending Home Leaves</div>
              </div>
            </div>
          </div>

          <section class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="module-grid">
              
              <div class="module-card" [routerLink]="['/student/outgoing']">
                <div class="module-header">
                  <div class="module-icon" style="background:rgba(14,165,233,.12)">🚶</div>
                  <div class="module-title">Mark Outgoing</div>
                </div>
                <p class="module-desc">Going out for a while? Mark your departure time and destination here.</p>
                <div class="module-footer"><span class="module-action">Mark Now →</span></div>
              </div>

              <div class="module-card" [routerLink]="['/student/home-going']">
                <div class="module-header">
                  <div class="module-icon" style="background:rgba(139,92,246,.12)">🏡</div>
                  <div class="module-title">Home Going</div>
                </div>
                <p class="module-desc">Request permission for home visits or record your departure.</p>
                <div class="module-footer"><span class="module-action">Go to Page →</span></div>
              </div>

              <div class="module-card" [routerLink]="['/student/mess-cut']">
                <div class="module-header">
                  <div class="module-icon" style="background:rgba(245,158,11,.12)">🍽️</div>
                  <div class="module-title">Mess Cut</div>
                </div>
                <p class="module-desc">Apply for mess cut for upcoming dates to save on mess bills.</p>
                <div class="module-footer"><span class="module-action">Apply Now →</span></div>
              </div>

              <div class="module-card" [routerLink]="['/student/return']">
                <div class="module-header">
                  <div class="module-icon" style="background:rgba(16,185,129,.12)">📍</div>
                  <div class="module-title">Mark Return</div>
                </div>
                <p class="module-desc">Arrived back at hostel? Use GPS to confirm your return.</p>
                <div class="module-footer"><span class="module-action">Mark Return →</span></div>
              </div>

            </div>
          </section>

          <section class="notifications-section mt">
             <div class="section-header">
                <h2>Recent Notifications</h2>
                <a class="view-all" [routerLink]="['/student/notifications']">View All</a>
             </div>
             <div class="card notif-card">
                <div *ngIf="notifications.length === 0" class="empty-state">No new notifications</div>
                <div *ngFor="let n of notifications.slice(0,3)" class="notif-item">
                   <div class="notif-bullet"></div>
                   <div class="notif-body">
                      <h6>{{ n.title }}</h6>
                      <p>{{ n.message }}</p>
                      <span class="notif-time">{{ n.createdAt | date:'shortTime' }}</span>
                   </div>
                </div>
             </div>
          </section>

        </main>
      </div>
    </div>
  `,
  styles: [`
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: var(--card);
      border-radius: 20px;
      padding: 24px;
      box-shadow: var(--shadow);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .stat-icon.blue { background: rgba(26, 86, 219, .12); }
    .stat-icon.green { background: rgba(16, 185, 129, .12); }
    .stat-icon.orange { background: rgba(245, 158, 11, .12); }
    .stat-icon.purple { background: rgba(139, 92, 246, .12); }

    .stat-value {
      font-family: 'Outfit', sans-serif;
      font-size: 26px;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 13px;
      color: var(--muted);
      font-weight: 600;
    }

    h2 { font-size: 18px; font-weight: 800; margin-bottom: 20px; }
    
    .module-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
    }

    .module-card {
      background: var(--card);
      border-radius: 24px;
      padding: 24px;
      box-shadow: var(--shadow);
      cursor: pointer;
      transition: all .2s;
      border: 2px solid transparent;
    }

    .module-card:hover {
      border-color: var(--primary);
      transform: translateY(-4px);
    }

    .module-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 14px;
    }

    .module-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }

    .module-title {
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 700;
    }

    .module-desc {
      font-size: 13px;
      color: var(--muted);
      line-height: 1.5;
    }

    .module-footer {
      margin-top: 18px;
    }

    .module-action {
      font-size: 12px;
      font-weight: 700;
      color: var(--primary);
    }

    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .view-all { font-size: 13px; font-weight: 700; color: var(--primary); text-decoration: none; }
    .mt { margin-top: 40px; }
    
    .notif-card { padding: 8px 0; }
    .notif-item { display: flex; gap: 16px; padding: 16px 24px; border-bottom: 1px solid var(--border); }
    .notif-item:last-child { border-bottom: none; }
    .notif-bullet { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; margin-top: 6px; }
    .notif-body h6 { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
    .notif-body p { font-size: 13px; color: var(--muted); margin-bottom: 4px; }
    .notif-time { font-size: 11px; color: var(--muted); font-weight: 500; }
    .empty-state { padding: 32px; text-align: center; color: var(--muted); font-size: 14px; }
  `]
})
export class StudentDashboardComponent implements OnInit {
  user: any;
  attendancePercent = 0;
  messCutDays = 0;
  activeOutgoings = 0;
  pendingHomeGoings = 0;
  notifications: any[] = [];

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit() {
    this.user = this.authService.userValue;
    this.loadStats();
    this.loadNotifications();
  }

  get headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.authService.userValue?.token}` }) };
  }

  loadStats() {
    // Attendance
    this.http.get<any>('http://localhost:5000/api/student/attendance', this.headers).subscribe({
      next: res => {
        const total = res.attendance.length;
        if (total > 0) {
          const present = res.attendance.filter((a: any) => a.status === 'present').length;
          this.attendancePercent = Math.round((present / total) * 100);
        }
      }
    });

    // Mess Cut
    this.http.get<any>('http://localhost:5000/api/student/mess-cut', this.headers).subscribe({
      next: res => {
        this.messCutDays = res.messCuts.filter((m: any) => m.status === 'approved').length; // Simplification
      }
    });

    // Outgoings
    this.http.get<any>('http://localhost:5000/api/student/outgoing', this.headers).subscribe({
      next: res => {
        this.activeOutgoings = res.outgoings.filter((o: any) => o.status === 'active').length;
      }
    });

    // Homegoings
    this.http.get<any>('http://localhost:5000/api/student/home-going', this.headers).subscribe({
      next: res => {
        this.pendingHomeGoings = res.homeGoings.filter((h: any) => h.status === 'pending').length;
      }
    });
  }

  loadNotifications() {
    this.http.get<any>('http://localhost:5000/api/student/notifications', this.headers).subscribe({
      next: res => {
        this.notifications = res.notifications || [];
      }
    });
  }
}
