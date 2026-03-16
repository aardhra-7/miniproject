import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'web-faculty-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopbarComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class FacultyDashboardComponent implements OnInit {
  user: any;
  notifications: any[] = [];
  stats = { attendanceCount: 0, messCutCount: 0, homeGoingCount: 0 };

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.user = this.auth.userValue;
    this.loadStats();
    this.loadNotifications();
  }

  get headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
  }

  loadStats() {
    this.http.get<any>('http://localhost:5000/api/faculty/attendance', this.headers).subscribe({
      next: (res) => {
        const history = res.history || [];
        this.stats.attendanceCount = history.filter((a: any) => a.status === 'present').length;
      }
    });

    this.http.get<any>('http://localhost:5000/api/faculty/mess-cut', this.headers).subscribe({
      next: (res) => {
        this.stats.messCutCount = (res.history || []).length;
      }
    });

    this.http.get<any>('http://localhost:5000/api/faculty/home-going', this.headers).subscribe({
      next: (res) => {
        this.stats.homeGoingCount = (res.history || []).length;
      }
    });
  }

  loadNotifications() {
    this.http.get<any>('http://localhost:5000/api/faculty/notifications', this.headers).subscribe({
      next: (res) => this.notifications = res.notifications || []
    });
  }
}
