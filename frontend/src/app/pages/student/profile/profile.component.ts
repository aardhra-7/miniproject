import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'student'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'My Profile'" [userName]="user?.name || 'Student'"></app-topbar>
        <main class="page-content">
          <div class="profile-banner">
            <div class="profile-avatar">{{ initials }}</div>
            <div>
              <div class="profile-name">{{ user?.name }}</div>
              <div class="profile-meta">{{ user?.role | titlecase }} | {{ user?.semester || 'Semester not set' }}</div>
            </div>
          </div>

          <div class="info-sections">
            <div class="card p-24 mb-24">
              <h3 class="section-title">Personal Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">User ID</div>
                  <div class="info-value">{{ user?.userId }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">{{ user?.email }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Phone No</div>
                  <div class="info-value">{{ user?.phone }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Room Number</div>
                  <div class="info-value">{{ user?.roomNumber || 'Not assigned' }}</div>
                </div>
              </div>
            </div>

            <div class="card p-24 mb-24">
              <h3 class="section-title">Academic Details</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Admission No.</div>
                  <div class="info-value">{{ user?.admissionNo || '—' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Semester</div>
                  <div class="info-value">{{ user?.semester || '—' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Date of Admission</div>
                  <div class="info-value">{{ (user?.dateOfAdmission | date:'longDate') || '—' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Passing Year</div>
                  <div class="info-value">{{ user?.passingYear || '—' }}</div>
                </div>
              </div>
            </div>

            <div class="card p-24">
              <h3 class="section-title">Guardian & Address</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Guardian's Name</div>
                  <div class="info-value">{{ user?.guardiansName || '—' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Guardian's Phone</div>
                  <div class="info-value">{{ user?.guardiansPhone || '—' }}</div>
                </div>
                <div class="info-item full-width">
                  <div class="info-label">Permanent Address</div>
                  <div class="info-value">{{ user?.address || '—' }}</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .profile-banner {
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      border-radius: var(--radius);
      padding: 32px;
      color: #fff;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 24px;
      box-shadow: var(--shadow);
    }
    .profile-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(255, 255, 255, .2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 800;
      border: 3px solid rgba(255, 255, 255, .5);
    }
    .profile-name { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .profile-meta { font-size: 14px; opacity: 0.9; }

    .section-title { font-size: 16px; font-weight: 700; margin-bottom: 20px; color: var(--text); padding-bottom: 12px; border-bottom: 1px solid var(--border); }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
    .info-item { display: flex; flex-direction: column; }
    .info-label { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; margin-bottom: 6px; letter-spacing: .5px; }
    .info-value { font-size: 15px; font-weight: 600; color: var(--text); }
    .full-width { grid-column: 1 / -1; }
    
    .card { background: var(--card); border-radius: 16px; box-shadow: var(--shadow); }
    .p-24 { padding: 24px; }
    .mb-24 { margin-bottom: 24px; }
  `]
})
export class StudentProfileComponent implements OnInit {
  user: any;

  constructor(private auth: AuthService, private http: HttpClient) { }

  ngOnInit() {
    this.loadProfile();
  }

  get initials(): string {
    return this.user?.name?.split(' ').map((n: any) => n[0]).join('').toUpperCase().substring(0, 2) || 'S';
  }

  loadProfile() {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` });
    this.http.get<any>('http://localhost:5000/api/student/profile', { headers }).subscribe({
      next: (res) => this.user = res.user,
      error: () => { }
    });
  }
}
