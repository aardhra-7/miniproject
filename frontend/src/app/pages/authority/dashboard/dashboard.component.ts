import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-authority-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent, RouterLink],
  template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'authority'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Authority Dashboard'"></app-topbar>
        <main class="page-content">
          
          <div class="stats-grid">
            <div class="stat-card orange" routerLink="/authority/requests">
              <div class="stat-icon">🍽️</div>
              <div class="stat-details">
                <span class="stat-value">{{ summary.pendingMessCuts }}</span>
                <span class="stat-label">Pending Mess Cuts</span>
              </div>
            </div>
            <div class="stat-card purple" routerLink="/authority/requests">
              <div class="stat-icon">🏡</div>
              <div class="stat-details">
                <span class="stat-value">{{ summary.pendingHomeGoings }}</span>
                <span class="stat-label">Pending Home Leaves</span>
              </div>
            </div>
            <div class="stat-card blue">
              <div class="stat-icon">🚶</div>
              <div class="stat-details">
                <span class="stat-value">{{ summary.todayOutgoings }}</span>
                <span class="stat-label">Today's Outgoings</span>
              </div>
            </div>
            <div class="stat-card green">
              <div class="stat-icon">🍽️</div>
              <div class="stat-details">
                <span class="stat-value">{{ summary.activeMessCuts }}</span>
                <span class="stat-label">Active Mess Cuts</span>
              </div>
            </div>
          </div>

          <div class="dashboard-grid">
            <!-- Attendance Marking -->
            <div class="card attendance-card">
              <div class="card-header">
                <div class="title-group">
                  <h3>Daily Attendance</h3>
                  <p class="subtitle">Mark students present for today</p>
                </div>
                <div class="header-actions">
                   <input type="text" [(ngModel)]="attendanceSearch" (input)="filterAttendanceStudents()" placeholder="Search Student..." class="search-input" />
                </div>
              </div>
              
              <div class="table-container">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Student Name</th>
                      <th>ID</th>
                      <th style="text-align: right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let s of filteredAttendanceStudents">
                      <td class="room-cell">{{ s.roomNumber }}</td>
                      <td>
                        <div class="student-cell">
                          <div class="avatar">{{ s.name[0] }}</div>
                          <span>{{ s.name }}</span>
                        </div>
                      </td>
                      <td class="id-cell">{{ s.userId }}</td>
                      <td style="text-align: right">
                        <div class="action-btns">
                          <button class="btn-sm btn-success" (click)="markIndividual(s._id, 'present')">P</button>
                          <button class="btn-sm btn-danger" (click)="markIndividual(s._id, 'absent')">A</button>
                        </div>
                      </td>
                    </tr>
                    <tr *ngIf="filteredAttendanceStudents.length === 0">
                      <td colspan="4" class="empty-state">No matching students found.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px; }
    .stat-card { background: var(--card); padding: 24px; border-radius: 20px; box-shadow: var(--shadow); display: flex; align-items: center; gap: 16px; cursor: pointer; transition: transform .2s; }
    .stat-card:hover { transform: translateY(-4px); }
    .stat-icon { font-size: 28px; width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: var(--bg); }
    .stat-details { display: flex; flex-direction: column; }
    .stat-value { font-size: 24px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
    .stat-label { font-size: 13px; color: var(--muted); font-weight: 600; }

    .stat-card.orange .stat-icon { background: rgba(245, 158, 11, .12); }
    .stat-card.purple .stat-icon { background: rgba(139, 92, 246, .12); }
    .stat-card.blue .stat-icon { background: rgba(14, 165, 233, .12); }
    .stat-card.green .stat-icon { background: rgba(16, 185, 129, .12); }

    .dashboard-grid { margin-top: 24px; }
    .card { background: var(--card); border-radius: 24px; padding: 32px; box-shadow: var(--shadow); }
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .title-group h3 { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
    .subtitle { font-size: 13px; color: var(--muted); }
    
    .header-actions { display: flex; gap: 12px; }
    .search-input { padding: 10px 16px; border: 2px solid var(--border); border-radius: 12px; font-size: 14px; outline: none; width: 240px; }
    .search-input:focus { border-color: var(--primary); }
    
    .table-container { border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: var(--bg); padding: 14px 20px; text-align: left; font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
    .table td { padding: 14px 20px; border-bottom: 1px solid var(--border); vertical-align: middle; font-size: 14px; }
    .table tr:last-child td { border-bottom: none; }
    .table tr.selected { background: rgba(14, 165, 233, .04); }
    
    .room-cell { font-weight: 800; color: var(--primary); font-family: 'Outfit'; }
    .student-cell { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 32px; height: 32px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
    .id-cell { color: var(--muted); font-size: 12px; font-family: monospace; }
    
    .btn-primary { background: var(--primary); color: #fff; border: none; padding: 12px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: background .2s; }
    .btn-primary:hover { background: #1a56db; }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
    
    .action-btns { display: flex; gap: 8px; justify-content: flex-end; }
    .btn-sm { padding: 6px 12px; border: none; border-radius: 6px; font-weight: 800; cursor: pointer; color: #fff; transition: opacity .2s; }
    .btn-sm:active { opacity: .8; }
    .btn-success { background: #10b981; }
    .btn-danger { background: #ef4444; }

    .empty-state { text-align: center; color: var(--muted); padding: 40px !important; }
  `]
})
export class AuthorityDashboardComponent implements OnInit {
  summary = {
    todayOutgoings: 0,
    todayHomeGoings: 0,
    activeMessCuts: 0,
    pendingHomeGoings: 0,
    pendingMessCuts: 0
  };

  students: any[] = [];
  filteredAttendanceStudents: any[] = [];
  attendanceSearch = '';
  selectedStudents = new Set<string>();
  marking = false;

  constructor(private http: HttpClient, public auth: AuthService) { }

  ngOnInit() {
    this.loadSummary();
    this.loadStudents();
  }

  get headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
  }

  loadSummary() {
    this.http.get<any>('http://localhost:5000/api/authority/summary', this.headers).subscribe({
      next: (res) => this.summary = res.summary || this.summary
    });
  }

  loadStudents() {
    this.http.get<any>('http://localhost:5000/api/authority/students', this.headers).subscribe({
      next: (res) => {
        this.students = res.students || [];
        this.filterAttendanceStudents();
      }
    });
  }

  filterAttendanceStudents() {
    const q = this.attendanceSearch.toLowerCase();
    this.filteredAttendanceStudents = this.students.filter(s =>
      s.name.toLowerCase().includes(q) || s.userId.toLowerCase().includes(q) || s.roomNumber?.includes(q)
    );
  }

  markIndividual(studentId: string, status: string) {
    this.http.post('http://localhost:5000/api/authority/attendance', {
      attendance: [{ student: studentId, status }]
    }, this.headers).subscribe({
      next: () => {
        // Quietly marked
      },
      error: () => alert('Failed to mark attendance')
    });
  }
}
