import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'web-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  @Input() pageTitle: string = 'Dashboard';
  @Input() userName: string = 'User';

  showNotifications = false;
  latestNotification: any = null;

  constructor(
    private location: Location,
    private http: HttpClient,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.fetchLatestNotification();
  }

  fetchLatestNotification() {
    const role = this.auth.userValue?.role;
    if (!role) return;

    this.http.get<any>(`http://localhost:5000/api/${role}/notifications`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` })
    }).subscribe({
      next: res => {
        const notifications = res.notifications || [];
        if (notifications.length > 0) {
          this.latestNotification = notifications[0];
        }
      }
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  get userInitials(): string {
    if (!this.userName) return 'U';
    return this.userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  goBack() {
    this.location.back();
  }
}
