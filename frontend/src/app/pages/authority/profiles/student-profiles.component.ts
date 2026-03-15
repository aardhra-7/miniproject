import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-student-profiles',
    standalone: true,
    imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
    template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'authority'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Student Profiles'"></app-topbar>
        <main class="page-content">

          <div class="page-header">
            <div class="header-text">
               <h1>Graduated / Current Students</h1>
               <p>Search and view detailed student records.</p>
            </div>
            <div class="search-box">
               <input type="text" [(ngModel)]="search" (input)="filter()" placeholder="Search by name, ID or room..." />
            </div>
          </div>

          <div class="profile-grid">
            <div *ngFor="let s of filteredStudents" class="profile-card">
              <div class="card-top">
                <div class="avatar">{{ s.name[0] }}</div>
                <div class="main-info">
                   <h3>{{ s.name }}</h3>
                   <code>{{ s.userId }}</code>
                </div>
                <span class="room-pill">{{ s.roomNumber }}</span>
              </div>
              
              <div class="card-body">
                 <div class="info-item">
                    <label>College</label>
                    <span>{{ s.collegeName || '—' }}</span>
                 </div>
                 <div class="info-item">
                    <label>Semester</label>
                    <span>Season {{ s.semester || '—' }}</span>
                 </div>
                 <div class="info-item">
                    <label>Mobile</label>
                    <a [href]="'tel:' + s.phone">{{ s.phone }}</a>
                 </div>
                 <div class="info-item">
                    <label>Email</label>
                    <span>{{ s.email }}</span>
                 </div>
              </div>

              <div class="card-footer">
                 <button class="btn-detail" (click)="selectedStudent = s">View Full Profile</button>
              </div>
            </div>
          </div>

          <!-- Quick Modal (Overlay) -->
          <div class="modal-overlay" *ngIf="selectedStudent" (click)="selectedStudent = null">
             <div class="modal" (click)="$event.stopPropagation()">
                <div class="modal-header">
                   <h3>Student Details</h3>
                   <button class="close" (click)="selectedStudent = null">×</button>
                </div>
                <div class="modal-body">
                   <div class="grid">
                      <div><label>Admission No</label><p>{{ selectedStudent.admissionNo }}</p></div>
                      <div><label>Hostel</label><p>{{ selectedStudent.hostelName }}</p></div>
                      <div><label>Guardian</label><p>{{ selectedStudent.guardiansName }}</p></div>
                      <div><label>Guardian Phone</label><p>{{ selectedStudent.guardiansPhone }}</p></div>
                      <div class="full"><label>Address</label><p>{{ selectedStudent.address }}</p></div>
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
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; gap: 24px; flex-wrap: wrap; }
    .header-text h1 { font-size: 24px; font-weight: 800; }
    .header-text p { color: var(--muted); font-size: 14px; margin-top: 4px; }
    
    .search-box input { padding: 12px 20px; border: 2px solid var(--border); border-radius: 14px; width: 320px; outline: none; transition: border .2s; }
    .search-box input:focus { border-color: var(--primary); }

    .profile-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
    .profile-card { background: var(--card); border-radius: 24px; overflow: hidden; box-shadow: var(--shadow); transition: transform .2s; border: 1px solid var(--border); }
    .profile-card:hover { transform: translateY(-4px); }
    
    .card-top { padding: 24px; background: rgba(0,0,0,.01); display: flex; align-items: center; gap: 16px; border-bottom: 1px solid var(--border); position: relative; }
    .avatar { width: 48px; height: 48px; background: var(--primary); color: #fff; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; }
    .main-info h3 { font-size: 16px; font-weight: 800; line-height: 1.2; }
    .main-info code { font-size: 11px; color: var(--muted); font-weight: 700; }
    .room-pill { position: absolute; top: 24px; right: 24px; background: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; border: 1px solid var(--border); }
    
    .card-body { padding: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .info-item label { display: block; font-size: 10px; font-weight: 700; color: var(--muted); text-transform: uppercase; margin-bottom: 2px; }
    .info-item span, .info-item a { font-size: 13px; font-weight: 600; color: var(--text); text-decoration: none; }
    .info-item a:hover { color: var(--primary); }
    
    .card-footer { padding: 16px 24px; background: var(--bg); border-top: 1px solid var(--border); }
    .btn-detail { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid var(--primary); background: transparent; color: var(--primary); font-weight: 700; font-size: 13px; cursor: pointer; transition: all .2s; }
    .btn-detail:hover { background: var(--primary); color: #fff; }

    /* Modal Styling */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
    .modal { background: var(--card); border-radius: 24px; width: 100%; max-width: 500px; box-shadow: var(--shadow-lg); overflow: hidden; }
    .modal-header { padding: 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
    .modal-header h3 { font-size: 18px; font-weight: 800; }
    .close { background: none; border: none; font-size: 28px; cursor: pointer; color: var(--muted); }
    .modal-body { padding: 24px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .grid label { font-size: 10px; font-weight: 700; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 4px; }
    .grid p { font-weight: 600; font-size: 15px; }
    .full { grid-column: span 2; }
  `]
})
export class StudentProfilesComponent implements OnInit {
    students: any[] = [];
    filteredStudents: any[] = [];
    search = '';
    selectedStudent: any = null;

    constructor(private http: HttpClient, private auth: AuthService) { }

    get headers() {
        return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
    }

    ngOnInit() { this.load(); }

    load() {
        this.http.get<any>('http://localhost:5000/api/authority/students', this.headers).subscribe({
            next: res => {
                this.students = res.students || [];
                this.filter();
            }
        });
    }

    filter() {
        const q = this.search.toLowerCase();
        this.filteredStudents = this.students.filter(s =>
            s.name.toLowerCase().includes(q) || s.userId.toLowerCase().includes(q) || s.roomNumber?.includes(q)
        );
    }
}
