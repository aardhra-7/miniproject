import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'web-view-notifications',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopbarComponent],
  templateUrl: './view-notifications.component.html',
  styleUrls: ['./view-notifications.component.css']
})
export class ViewNotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` });
    this.http.get<any>('http://localhost:5000/api/student/notifications', { headers }).subscribe({
      next: res => this.notifications = res.notifications || [],
      error: () => { }
    });
  }
}
