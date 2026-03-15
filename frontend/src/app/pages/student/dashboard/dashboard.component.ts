import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'student'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Student Dashboard'" [userName]="user?.name"></app-topbar>
        <main class="page-content">
          <div class="greeting">
            <h1>Good Morning! 👋</h1>
            <p>Welcome back, {{ user?.name }}</p>
          </div>

          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-icon green">📊</div>
              <div>
                <div class="stat-value">85%</div>
                <div class="stat-label">Attendance %</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon orange">🍽️</div>
              <div>
                <div class="stat-value">12</div>
                <div class="stat-label">Mess Cut Days</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon blue">🚶</div>
              <div>
                <div class="stat-value">4</div>
                <div class="stat-label">Outgoings</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon purple">🏡</div>
              <div>
                <div class="stat-value">2</div>
                <div class="stat-label">Home Leaves</div>
              </div>
            </div>
          </div>

          <section class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="module-grid">
              <div class="module-card">
                <div class="module-header">
                  <div class="module-icon" style="background:rgba(14,165,233,.12)">🚶</div>
                  <div class="module-title">Outgoing</div>
                </div>
                <p class="module-desc">Mark yourself as going out of hostel with reason and expected return time</p>
                <div class="module-footer"><span class="module-action">Apply Now →</span></div>
              </div>
              <div class="module-card">
                <div class="module-header">
                  <div class="module-icon" style="background:rgba(139,92,246,.12)">🏡</div>
                  <div class="module-title">Home Going</div>
                </div>
                <p class="module-desc">Request permission for going home with date range and reason</p>
                <div class="module-footer"><span class="module-action">Request →</span></div>
              </div>
              <div class="module-card">
                <div class="module-header">
                  <div class="module-icon" style="background:rgba(245,158,11,.12)">🍽️</div>
                  <div class="module-title">Mess Cut</div>
                </div>
                <p class="module-desc">Apply for mess cut when you won't be available for meals</p>
                <div class="module-footer"><span class="module-action">Apply →</span></div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .greeting h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .greeting p {
      color: var(--muted);
      font-size: 14px;
      margin-bottom: 28px;
    }

    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 28px;
    }

    .stat-card {
      background: var(--card);
      border-radius: var(--radius);
      padding: 20px 24px;
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
      font-size: 28px;
      font-weight: 800;
    }

    .stat-label {
      font-size: 12px;
      color: var(--muted);
      font-weight: 500;
    }

    .quick-actions h2 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .module-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .module-card {
      background: var(--card);
      border-radius: var(--radius);
      padding: 24px;
      box-shadow: var(--shadow);
      cursor: pointer;
      transition: all .2s;
      border: 2px solid transparent;
    }

    .module-card:hover {
      border-color: var(--primary);
      transform: translateY(-2px);
    }

    .module-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 12px;
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
      margin-top: 16px;
    }

    .module-action {
      font-size: 12px;
      font-weight: 600;
      color: var(--primary);
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.userValue;
  }
}
