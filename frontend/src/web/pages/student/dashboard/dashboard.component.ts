import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'web-student-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopbarComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
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
        const approved = res.messCuts.filter((m: any) => m.status === 'approved');
        this.messCutDays = approved.reduce((sum: number, m: any) => {
          const start = new Date(m.startDate);
          const end = new Date(m.endDate);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          return sum + diffDays;
        }, 0);
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
