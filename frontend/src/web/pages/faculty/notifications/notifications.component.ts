import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'web-faculty-notifications',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopbarComponent],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class FacultyNotificationsComponent implements OnInit {
  user: any;
  notifications: any[] = [];

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.user = this.auth.userValue;
    this.loadNotifications();
  }

  loadNotifications() {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` });
    this.http.get<any>('http://localhost:5000/api/faculty/notifications', { headers }).subscribe({
      next: (res) => this.notifications = res.notifications || []
    });
  }
}
