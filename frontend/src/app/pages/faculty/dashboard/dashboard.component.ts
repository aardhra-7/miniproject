import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-faculty-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'faculty'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Faculty Dashboard'" [userName]="user?.name || 'Faculty'"></app-topbar>
        <main class="page-content">
          
          <div class="dashboard-tabs">
            <button [class.active]="activeTab === 'profile'" (click)="activeTab = 'profile'">Profile</button>
            <button [class.active]="activeTab === 'attendance'" (click)="activeTab = 'attendance'; loadAttendance()">Attendance</button>
            <button [class.active]="activeTab === 'mess-cut'" (click)="activeTab = 'mess-cut'; loadMessCuts()">Mess Cut</button>
            <button [class.active]="activeTab === 'home-going'" (click)="activeTab = 'home-going'; loadHomeGoings()">Home Going</button>
            <button [class.active]="activeTab === 'notifications'" (click)="activeTab = 'notifications'; loadNotifications()">Notifications</button>
          </div>

          <div class="tab-content">
            <!-- Profile Tab -->
            <div *ngIf="activeTab === 'profile'" class="card p-24 anim-fade">
              <div class="section-header">
                <h3>My Profile</h3>
                <button class="btn-text" (click)="toggleEdit()">
                  {{ isEditing ? 'Cancel' : 'Edit Contact' }}
                </button>
              </div>
              <div class="profile-info">
                <div class="info-item">
                  <label>Full Name</label>
                  <input *ngIf="isEditing" [(ngModel)]="editData.name" class="form-control" />
                  <span *ngIf="!isEditing">{{ user?.name }}</span>
                </div>
                <div class="info-item">
                  <label>Department</label>
                  <span>{{ user?.department || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <label>Email</label>
                  <span>{{ user?.email }}</span>
                </div>
                <div class="info-item">
                  <label>Phone No</label>
                  <input *ngIf="isEditing" [(ngModel)]="editData.phone" class="form-control" />
                  <span *ngIf="!isEditing">{{ user?.phone }}</span>
                </div>
                <button *ngIf="isEditing" class="btn-primary mt-12" (click)="saveProfile()">Save Changes</button>
              </div>
            </div>

            <!-- Attendance Tab -->
            <div *ngIf="activeTab === 'attendance'" class="anim-fade">
              <div class="card p-24 mb-24">
                <h3>Mark Daily Attendance</h3>
                <p class="text-muted">Register your presence for today ({{ today | date:'mediumDate' }})</p>
                <div class="attendance-actions mt-16">
                  <button class="btn-primary btn-success" (click)="markAttendance('present')">Mark as Present</button>
                  <button class="btn-primary btn-outline-danger ml-12" (click)="markAttendance('absent')">Mark as Absent</button>
                </div>
              </div>
              <div class="card p-24">
                <h3>Attendance History</h3>
                <div class="table-responsive mt-16">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let item of attendanceHistory">
                        <td>{{ item.date | date:'mediumDate' }}</td>
                        <td>
                          <span [class]="'badge ' + (item.status === 'present' ? 'success' : 'danger')">
                            {{ item.status | titlecase }}
                          </span>
                        </td>
                      </tr>
                      <tr *ngIf="attendanceHistory.length === 0">
                        <td colspan="2" class="empty-td">No history found.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Mess Cut Tab -->
            <div *ngIf="activeTab === 'mess-cut'" class="anim-fade">
              <div class="card p-24 mb-24">
                <h3>Request Mess Cut</h3>
                <div class="form-grid mt-16">
                  <div class="form-group">
                    <label>From Date</label>
                    <input type="date" class="form-control" [(ngModel)]="messCutForm.startDate" />
                  </div>
                  <div class="form-group">
                    <label>To Date</label>
                    <input type="date" class="form-control" [(ngModel)]="messCutForm.endDate" />
                  </div>
                  <div class="form-group full-width">
                    <label>Reason</label>
                    <textarea class="form-control" [(ngModel)]="messCutForm.reason" rows="2"></textarea>
                  </div>
                </div>
                <button class="btn-primary mt-12" (click)="submitMessCut()">Submit Request</button>
              </div>
              <div class="card p-24">
                <h3>Request History</h3>
                <div class="table-responsive mt-16">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Reason</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let m of messCutHistory">
                        <td>{{ m.startDate | date:'dd MMM' }} - {{ m.endDate | date:'dd MMM' }}</td>
                        <td>{{ m.reason }}</td>
                        <td>
                          <span [class]="'badge ' + m.status">{{ m.status | titlecase }}</span>
                        </td>
                      </tr>
                      <tr *ngIf="messCutHistory.length === 0">
                        <td colspan="3" class="empty-td">No requests found.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Home Going Tab -->
            <div *ngIf="activeTab === 'home-going'" class="anim-fade">
              <div class="card p-24 mb-24">
                <h3>Record Home Going</h3>
                <div class="form-grid mt-16">
                  <div class="form-group">
                    <label>Leave Date</label>
                    <input type="date" class="form-control" [(ngModel)]="homeGoingForm.leaveDate" />
                  </div>
                  <div class="form-group">
                    <label>Return Date</label>
                    <input type="date" class="form-control" [(ngModel)]="homeGoingForm.returnDate" />
                  </div>
                  <div class="form-group">
                    <label>Destination</label>
                    <input type="text" class="form-control" placeholder="Place" [(ngModel)]="homeGoingForm.place" />
                  </div>
                  <div class="form-group">
                    <label>Reason</label>
                    <input type="text" class="form-control" placeholder="Reason" [(ngModel)]="homeGoingForm.reason" />
                  </div>
                </div>
                <button class="btn-primary mt-12" (click)="submitHomeGoing()">Mark Home Going</button>
              </div>
              <div class="card p-24">
                <h3>Previous Entries</h3>
                <div class="table-responsive mt-16">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Leave Date</th>
                        <th>Return Date</th>
                        <th>Destination</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let h of homeGoingHistory">
                        <td>{{ h.leaveDate | date:'mediumDate' }}</td>
                        <td>{{ h.returnDate | date:'mediumDate' }}</td>
                        <td>{{ h.place }}</td>
                        <td>{{ h.reason }}</td>
                      </tr>
                      <tr *ngIf="homeGoingHistory.length === 0">
                        <td colspan="4" class="empty-td">No entries found.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Notifications Tab -->
            <div *ngIf="activeTab === 'notifications'" class="anim-fade">
              <div class="card p-24">
                <h3>Recent Announcements</h3>
                <div class="notifications-list mt-16">
                  <div *ngFor="let n of notifications" class="notif-item">
                    <div class="notif-header">
                      <span class="notif-title">{{ n.title }}</span>
                      <span class="notif-date">{{ n.createdAt | date:'short' }}</span>
                    </div>
                    <p class="notif-msg">{{ n.message }}</p>
                  </div>
                  <div *ngIf="notifications.length === 0" class="empty-td">No announcements yet.</div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-tabs { display: flex; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 12px; }
    .dashboard-tabs button { background: none; border: none; padding: 10px 20px; font-weight: 600; cursor: pointer; color: var(--muted); border-radius: 8px; transition: all .2s; }
    .dashboard-tabs button:hover { background: var(--bg); color: var(--primary); }
    .dashboard-tabs button.active { background: var(--primary); color: #fff; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }

    .card { background: var(--card); border-radius: 20px; box-shadow: var(--shadow); border: 1px solid var(--border); }
    .p-24 { padding: 24px; }
    .mb-24 { margin-bottom: 24px; }
    .mt-12 { margin-top: 12px; }
    .mt-16 { margin-top: 16px; }
    .ml-12 { margin-left: 12px; }
    
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .section-header h3 { font-size: 16px; font-weight: 700; color: var(--text); }
    
    .profile-info { display: flex; flex-direction: column; gap: 16px; }
    .info-item { display: flex; flex-direction: column; gap: 4px; }
    .info-item label { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; }
    .info-item span { font-size: 15px; font-weight: 600; color: var(--text); }
    
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 13px; font-weight: 600; }
    .full-width { grid-column: span 2; }
    .form-control { width: 100%; padding: 10px 14px; border: 2px solid var(--border); border-radius: 10px; font-size: 14px; background: var(--bg); color: var(--text); outline: none; transition: border-color .2s; }
    .form-control:focus { border-color: var(--primary); }

    .btn-primary { background: var(--primary); color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: transform .2s; }
    .btn-primary:active { transform: scale(0.98); }
    .btn-success { background: #10b981; }
    .btn-outline-danger { background: none; border: 2px solid #ef4444; color: #ef4444; }
    .btn-text { background: none; border: none; color: var(--primary); font-weight: 600; cursor: pointer; font-size: 13px; }

    .table-responsive { width: 100%; overflow-x: auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 700; color: var(--muted); text-transform: uppercase; border-bottom: 1px solid var(--border); }
    .table td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid var(--border); }
    
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .badge.success { background: #dcfce7; color: #166534; }
    .badge.danger { background: #fee2e2; color: #991b1b; }
    .badge.pending { background: #fef9c3; color: #854d0e; }
    .badge.marked { background: #dbeafe; color: #1e40af; }

    .notifications-list { display: flex; flex-direction: column; gap: 12px; }
    .notif-item { padding: 16px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; }
    .notif-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .notif-title { font-weight: 700; font-size: 14px; color: var(--primary); }
    .notif-date { font-size: 11px; color: var(--muted); }
    .notif-msg { font-size: 13px; color: var(--text); margin: 0; }

    .anim-fade { animation: fadeIn 0.3s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .empty-td { text-align: center; color: var(--muted); padding: 32px !important; }
    .text-muted { color: var(--muted); font-size: 14px; }
  `]
})
export class FacultyDashboardComponent implements OnInit {
  user: any;
  activeTab = 'profile';
  today = new Date();

  // History lists
  attendanceHistory: any[] = [];
  messCutHistory: any[] = [];
  homeGoingHistory: any[] = [];
  notifications: any[] = [];

  // Forms
  isEditing = false;
  editData = { name: '', phone: '' };
  messCutForm = { startDate: '', endDate: '', reason: '' };
  homeGoingForm = { leaveDate: '', returnDate: '', place: '', reason: '' };

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.loadProfile();
  }

  get headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
  }

  loadProfile() {
    this.http.get<any>('http://localhost:5000/api/faculty/profile', this.headers).subscribe({
      next: (res) => {
        this.user = res.user;
        this.editData.name = this.user.name;
        this.editData.phone = this.user.phone;
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editData.name = this.user.name;
      this.editData.phone = this.user.phone;
    }
  }

  saveProfile() {
    this.http.put('http://localhost:5000/api/faculty/profile', this.editData, this.headers).subscribe({
      next: () => {
        this.isEditing = false;
        this.loadProfile();
        alert('Profile updated successfully!');
      },
      error: (err) => alert(err.error?.message || 'Update failed')
    });
  }

  // --- Attendance ---
  loadAttendance() {
    this.http.get<any>('http://localhost:5000/api/faculty/attendance', this.headers).subscribe({
      next: (res) => this.attendanceHistory = res.history || []
    });
  }

  markAttendance(status: string) {
    this.http.post('http://localhost:5000/api/faculty/attendance', { status }, this.headers).subscribe({
      next: () => {
        alert(`Marked as ${status}`);
        this.loadAttendance();
      },
      error: (err) => alert(err.error?.message || 'Failed to mark attendance')
    });
  }

  // --- Mess Cut ---
  loadMessCuts() {
    this.http.get<any>('http://localhost:5000/api/faculty/mess-cut', this.headers).subscribe({
      next: (res) => this.messCutHistory = res.history || []
    });
  }

  submitMessCut() {
    if (!this.messCutForm.startDate || !this.messCutForm.endDate) return alert('Please select dates');
    this.http.post('http://localhost:5000/api/faculty/mess-cut', this.messCutForm, this.headers).subscribe({
      next: () => {
        alert('Mess cut request submitted');
        this.messCutForm = { startDate: '', endDate: '', reason: '' };
        this.loadMessCuts();
      },
      error: (err) => alert(err.error?.message || 'Submission failed')
    });
  }

  // --- Home Going ---
  loadHomeGoings() {
    this.http.get<any>('http://localhost:5000/api/faculty/home-going', this.headers).subscribe({
      next: (res) => this.homeGoingHistory = res.history || []
    });
  }

  submitHomeGoing() {
    if (!this.homeGoingForm.leaveDate) return alert('Please select leave date');
    this.http.post('http://localhost:5000/api/faculty/home-going', this.homeGoingForm, this.headers).subscribe({
      next: () => {
        alert('Home going recorded');
        this.homeGoingForm = { leaveDate: '', returnDate: '', place: '', reason: '' };
        this.loadHomeGoings();
      },
      error: (err) => alert(err.error?.message || 'Submission failed')
    });
  }

  // --- Notifications ---
  loadNotifications() {
    this.http.get<any>('http://localhost:5000/api/faculty/notifications', this.headers).subscribe({
      next: (res) => this.notifications = res.notifications || []
    });
  }
}
