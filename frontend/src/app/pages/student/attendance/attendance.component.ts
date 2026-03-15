import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-attendance',
    standalone: true,
    imports: [CommonModule, SidebarComponent, TopbarComponent],
    template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'student'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'Attendance'"></app-topbar>
        <main class="page-content">

          <div class="page-header">
            <h1>Attendance Calendar</h1>
            <p>Track your daily attendance status. Percentage: <strong>{{ attendancePercent }}%</strong></p>
          </div>

          <div class="calendar-container card">
            <div class="calendar-header">
              <button class="btn-nav" (click)="prevMonth()">‹</button>
              <h3>{{ monthNames[viewDate.getMonth()] }} {{ viewDate.getFullYear() }}</h3>
              <button class="btn-nav" (click)="nextMonth()">›</button>
            </div>

            <div class="calendar-grid">
              <div class="day-name" *ngFor="let day of dayNames">{{ day }}</div>
              
              <div *ngFor="let empty of emptyDays" class="calendar-day empty"></div>
              
              <div *ngFor="let day of monthDays" class="calendar-day" [ngClass]="getAttendanceClass(day)">
                <span class="day-num">{{ day }}</span>
                <div class="status-dot" *ngIf="getAttendanceStatus(day)"></div>
              </div>
            </div>

            <div class="calendar-legend">
              <div class="legend-item"><span class="dot present"></span> Present</div>
              <div class="legend-item"><span class="dot absent"></span> Absent</div>
              <div class="legend-item"><span class="dot none"></span> No Data</div>
            </div>
          </div>

          <div class="history-card card mt">
            <h3>Recent Records</h3>
            <div class="record-list">
              <div *ngFor="let r of attendanceRecords.slice(0, 10)" class="record-item">
                <span class="record-date">{{ r.date | date:'fullDate' }}</span>
                <span [class]="'badge badge-' + r.status">{{ r.status | titlecase }}</span>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  `,
    styles: [`
    :host { display: contents; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
    .page-header p { color: var(--muted); font-size: 14px; }

    .calendar-container { padding: 32px; }
    .calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .calendar-header h3 { font-size: 18px; font-weight: 700; }
    .btn-nav { background: var(--bg); border: 1px solid var(--border); width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 20px; transition: background .2s; }
    .btn-nav:hover { background: var(--border); }

    .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
    .day-name { text-align: center; font-size: 12px; font-weight: 700; color: var(--muted); padding-bottom: 12px; }
    .calendar-day { aspect-ratio: 1; border-radius: 12px; border: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; font-size: 14px; font-weight: 600; }
    .calendar-day.empty { border: none; }
    
    .day-present { background: rgba(16, 185, 129, .08); border-color: rgba(16, 185, 129, .2); color: #059669; }
    .day-absent { background: rgba(239, 68, 68, .08); border-color: rgba(239, 68, 68, .2); color: #dc2626; }
    
    .status-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 4px; }
    .day-present .status-dot { background: #059669; }
    .day-absent .status-dot { background: #dc2626; }

    .calendar-legend { display: flex; gap: 24px; margin-top: 24px; justify-content: center; padding-top: 24px; border-top: 1px solid var(--border); }
    .legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: var(--muted); }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot.present { background: #10b981; }
    .dot.absent { background: #ef4444; }
    .dot.none { border: 1px solid var(--border); }

    .mt { margin-top: 24px; }
    .history-card { padding: 24px; }
    .history-card h3 { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
    .record-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border); }
    .record-item:last-child { border-bottom: none; }
    .record-date { font-size: 14px; color: var(--text); }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
    .badge-present { background: rgba(16, 185, 129, .12); color: #059669; }
    .badge-absent { background: rgba(239, 68, 68, .12); color: #dc2626; }
  `]
})
export class AttendanceComponent implements OnInit {
    attendanceRecords: any[] = [];
    attendancePercent = 0;
    viewDate = new Date();
    monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    monthDays: number[] = [];
    emptyDays: number[] = [];

    constructor(private http: HttpClient, private auth: AuthService) { }

    ngOnInit() {
        this.loadAttendance();
        this.generateCalendar();
    }

    get headers() {
        return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
    }

    loadAttendance() {
        this.http.get<any>('http://localhost:5000/api/student/attendance', this.headers).subscribe({
            next: res => {
                this.attendanceRecords = res.attendance || [];
                this.calculatePercentage();
            }
        });
    }

    calculatePercentage() {
        const total = this.attendanceRecords.length;
        if (total === 0) return;
        const present = this.attendanceRecords.filter(r => r.status === 'present').length;
        this.attendancePercent = Math.round((present / total) * 100);
    }

    generateCalendar() {
        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        this.emptyDays = Array(firstDay).fill(0);
        this.monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    }

    prevMonth() {
        this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
        this.generateCalendar();
    }

    nextMonth() {
        this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
        this.generateCalendar();
    }

    getAttendanceStatus(day: number) {
        const d = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), day);
        return this.attendanceRecords.find(r => {
            const rd = new Date(r.date);
            return rd.toDateString() === d.toDateString();
        });
    }

    getAttendanceClass(day: number) {
        const record = this.getAttendanceStatus(day);
        if (!record) return '';
        return record.status === 'present' ? 'day-present' : 'day-absent';
    }
}
