import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-faculty-profiles',
    standalone: true,
    imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
    template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'authority'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Faculty Profiles'"></app-topbar>
        <main class="page-content">

          <div class="page-header">
            <div class="header-text">
               <h1>Staff & Faculty Directory</h1>
               <p>Quick access to faculty contact details and departments.</p>
            </div>
            <div class="search-box">
               <input type="text" [(ngModel)]="search" (input)="filter()" placeholder="Search by name, department or ID..." />
            </div>
          </div>

          <div class="profile-grid">
            <div *ngFor="let f of filteredFaculty" class="profile-card">
              <div class="card-top">
                <div class="avatar staff">{{ f.name[0] }}</div>
                <div class="main-info">
                   <h3>{{ f.name }}</h3>
                   <span class="dept">{{ f.department || 'General' }}</span>
                </div>
              </div>
              
              <div class="card-body">
                 <div class="info-item">
                    <label>Designation</label>
                    <span>{{ f.designation || 'Faculty' }}</span>
                 </div>
                 <div class="info-item">
                    <label>Room No</label>
                    <span>{{ f.roomNumber || '—' }}</span>
                 </div>
                 <div class="info-item">
                    <label>Mobile</label>
                    <a [href]="'tel:' + f.phone">{{ f.phone }}</a>
                 </div>
                 <div class="info-item">
                    <label>Email</label>
                    <span>{{ f.email }}</span>
                 </div>
              </div>

              <div class="card-footer">
                 <div class="meta-row">
                    <span class="blood"> {{ f.bloodGroup || '—' }}</span>
                    <span class="id">#{{ f.userId }}</span>
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
    .profile-card { background: var(--card); border-radius: 24px; overflow: hidden; box-shadow: var(--shadow); border: 1px solid var(--border); }
    
    .card-top { padding: 24px; background: rgba(0,0,0,.02); display: flex; align-items: center; gap: 16px; border-bottom: 1px solid var(--border); }
    .avatar.staff { width: 48px; height: 48px; background: #6366f1; color: #fff; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; }
    .main-info h3 { font-size: 16px; font-weight: 800; line-height: 1.2; }
    .main-info .dept { font-size: 12px; color: var(--muted); font-weight: 600; }
    
    .card-body { padding: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .info-item label { display: block; font-size: 10px; font-weight: 700; color: var(--muted); text-transform: uppercase; margin-bottom: 2px; }
    .info-item span, .info-item a { font-size: 13px; font-weight: 600; color: var(--text); text-decoration: none; word-break: break-all; }
    
    .card-footer { padding: 16px 24px; background: var(--bg); border-top: 1px solid var(--border); }
    .meta-row { display: flex; justify-content: space-between; align-items: center; }
    .blood { font-size: 12px; font-weight: 800; color: #ef4444; }
    .id { font-size: 11px; font-weight: 700; color: var(--muted); font-family: monospace; }
  `]
})
export class FacultyProfilesComponent implements OnInit {
    faculty: any[] = [];
    filteredFaculty: any[] = [];
    search = '';

    constructor(private http: HttpClient, private auth: AuthService) { }

    get headers() {
        return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
    }

    ngOnInit() { this.load(); }

    load() {
        this.http.get<any>('http://localhost:5000/api/authority/faculty', this.headers).subscribe({
            next: res => {
                this.faculty = res.faculty || [];
                this.filter();
            }
        });
    }

    filter() {
        const q = this.search.toLowerCase();
        this.filteredFaculty = this.faculty.filter(f =>
            f.name.toLowerCase().includes(q) || f.department?.toLowerCase().includes(q) || f.userId.toLowerCase().includes(q)
        );
    }
}
