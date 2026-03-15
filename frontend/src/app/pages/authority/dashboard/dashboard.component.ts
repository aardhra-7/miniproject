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
        <app-topbar [pageTitle]="'Authority Dashboard'" [userName]="auth.userValue?.name || 'Authority'"></app-topbar>
        <main class="page-content">
          <div class="stats-grid">
            <div class="stat-card primary" routerLink="/authority/requests">
              <div class="stat-icon">📋</div>
              <div class="stat-details">
                <span class="stat-value">{{ pendingCount }}</span>
                <span class="stat-label">Pending Requests</span>
              </div>
            </div>
            <div class="stat-card accent">
              <div class="stat-icon">👥</div>
              <div class="stat-details">
                <span class="stat-value">{{ studentCount }}</span>
                <span class="stat-label">Active Students</span>
              </div>
            </div>
          </div>

          <div class="dashboard-grid">
            <!-- Attendance Marking -->
            <div class="card attendance-card">
              <div class="card-header">
                <h3>Quick Attendance</h3>
                <button class="btn-primary" (click)="submitAttendance()" [disabled]="marking || selectedStudents.size === 0">
                  {{ marking ? 'Submitting...' : 'Mark Selected' }}
                </button>
              </div>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th style="width: 40px"><input type="checkbox" (change)="toggleAll($event)" /></th>
                      <th>Student</th>
                      <th>Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let s of students">
                      <td><input type="checkbox" [checked]="selectedStudents.has(s._id)" (change)="toggleStudent(s._id)" /></td>
                      <td>{{ s.name }}</td>
                      <td>{{ s.roomNumber }}</td>
                    </tr>
                    <tr *ngIf="students.length === 0">
                      <td colspan="3" class="empty-td">No active students to mark.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Monitoring -->
            <div class="card monitoring-card">
              <div class="card-header">
                <h3>Student Monitoring</h3>
                <input type="text" [(ngModel)]="search" (input)="filterStudents()" placeholder="Search..." class="search-input" />
              </div>
              <div class="monitoring-list">
                <div *ngFor="let s of filteredStudents" class="student-item" (click)="showStudentDetails(s)">
                  <div class="student-info">
                    <span class="student-name">{{ s.name }}</span>
                    <span class="student-meta">Room: {{ s.roomNumber }} | ID: {{ s.userId }}</span>
                  </div>
                  <span [class]="'status-badge ' + (s.isPresent ? 'present' : 'absent')">
                    {{ s.isPresent ? 'Inside' : 'Away' }}
                  </span>
                </div>
                <div *ngIf="filteredStudents.length === 0" class="empty-td">No students found.</div>
              </div>
            </div>
          </div>

          <!-- Student Detail Modal -->
          <div class="modal-overlay" *ngIf="selectedStudent">
            <div class="modal">
              <div class="modal-header">
                <h3>Student Details</h3>
                <button class="btn-close" (click)="selectedStudent = null">×</button>
              </div>
              <div class="details-grid">
                <div class="detail-item"><label>Name</label><span>{{ selectedStudent.name }}</span></div>
                <div class="detail-item"><label>Admission No</label><span>{{ selectedStudent.admissionNo }}</span></div>
                <div class="detail-item"><label>Room Number</label><span>{{ selectedStudent.roomNumber }}</span></div>
                <div class="detail-item"><label>Semester</label><span>{{ selectedStudent.semester }}</span></div>
                <div class="detail-item"><label>Email</label><span>{{ selectedStudent.email }}</span></div>
                <div class="detail-item"><label>Phone</label><span>{{ selectedStudent.phone }}</span></div>
                <div class="detail-item"><label>Guardian</label><span>{{ selectedStudent.guardiansName }}</span></div>
                <div class="detail-item"><label>Guardian Phone</label><span>{{ selectedStudent.guardiansPhone }}</span></div>
                <div class="detail-item full-width"><label>Address</label><span>{{ selectedStudent.address }}</span></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
    styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 32px; }
    .stat-card { background: var(--card); padding: 24px; border-radius: 20px; box-shadow: var(--shadow); display: flex; align-items: center; gap: 20px; cursor: pointer; transition: transform .2s; }
    .stat-card:hover { transform: translateY(-4px); }
    .stat-icon { font-size: 32px; background: var(--bg); width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
    .stat-details { display: flex; flex-direction: column; }
    .stat-value { font-size: 24px; font-weight: 800; color: var(--text); }
    .stat-label { font-size: 14px; color: var(--muted); font-weight: 600; }
    
    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    @media(max-width: 1000px) { .dashboard-grid { grid-template-columns: 1fr; } }
    
    .card { background: var(--card); border-radius: 20px; padding: 24px; box-shadow: var(--shadow); }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .card-header h3 { font-size: 16px; font-weight: 700; color: var(--text); }
    
    .table-responsive { max-height: 400px; overflow-y: auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { position: sticky; top: 0; background: var(--card); padding: 12px; text-align: left; font-size: 12px; font-weight: 700; color: var(--muted); border-bottom: 1px solid var(--border); }
    .table td { padding: 12px; font-size: 14px; border-bottom: 1px solid var(--border); }
    
    .search-input { padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; outline: none; }
    .monitoring-list { display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto; }
    .student-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid var(--border); border-radius: 12px; }
    .student-info { display: flex; flex-direction: column; }
    .student-name { font-weight: 700; font-size: 14px; }
    .student-meta { font-size: 11px; color: var(--muted); margin-top: 2px; }
    .status-badge { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .status-badge.present { background: #dcfce7; color: #166534; }
    .status-badge.absent { background: #fee2e2; color: #991b1b; }
    
    .btn-primary { background: var(--primary); color: #fff; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
    .empty-td { text-align: center; color: var(--muted); padding: 32px !important; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: var(--card); border-radius: 20px; padding: 32px; width: 90%; max-width: 500px; box-shadow: var(--shadow-lg); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .btn-close { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--muted); }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .detail-item { display: flex; flex-direction: column; gap: 4px; }
    .detail-item label { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; }
    .detail-item span { font-size: 14px; font-weight: 600; color: var(--text); }
    .full-width { grid-column: span 2; }
  `]
})
export class AuthorityDashboardComponent implements OnInit {
    pendingCount = 0;
    studentCount = 0;
    students: any[] = [];
    filteredStudents: any[] = [];
    search = '';
    selectedStudents = new Set<string>();
    marking = false;
    selectedStudent: any = null;

    showStudentDetails(student: any) {
        this.selectedStudent = student;
    }

    constructor(private http: HttpClient, public auth: AuthService) { }

    ngOnInit() {
        this.loadStats();
        this.loadStudents();
    }

    get headers() {
        return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
    }

    loadStats() {
        this.http.get<any>('http://localhost:5000/api/authority/requests', this.headers).subscribe({
            next: (res) => {
                this.pendingCount = (res.outgoings?.length || 0) + (res.homeGoings?.length || 0);
            }
        });
    }

    loadStudents() {
        this.http.get<any>('http://localhost:5000/api/authority/students', this.headers).subscribe({
            next: (res) => {
                this.students = res.students || [];
                this.studentCount = this.students.length;
                this.filterStudents();
            }
        });
    }

    filterStudents() {
        const q = this.search.toLowerCase();
        this.filteredStudents = this.students.filter(s =>
            s.name.toLowerCase().includes(q) || s.userId.toLowerCase().includes(q)
        );
    }

    toggleStudent(id: string) {
        if (this.selectedStudents.has(id)) this.selectedStudents.delete(id);
        else this.selectedStudents.add(id);
    }

    toggleAll(event: any) {
        if (event.target.checked) {
            this.students.forEach(s => this.selectedStudents.add(s._id));
        } else {
            this.selectedStudents.clear();
        }
    }

    submitAttendance() {
        this.marking = true;
        const items = Array.from(this.selectedStudents).map(id => ({
            student: id,
            status: 'present'
        }));

        this.http.post('http://localhost:5000/api/authority/attendance', { attendance: items }, this.headers).subscribe({
            next: () => {
                alert('Attendance marked successfully!');
                this.marking = false;
                this.selectedStudents.clear();
            },
            error: () => {
                alert('Failed to mark attendance');
                this.marking = false;
            }
        });
    }
}
