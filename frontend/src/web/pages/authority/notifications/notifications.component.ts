import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'web-authority-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  notification = {
    title: '',
    message: '',
    targetRole: 'all',
    type: 'general'
  };
  publishing = false;

  constructor(private http: HttpClient, private auth: AuthService) { }

  get headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
  }

  publish() {
    this.publishing = true;
    this.http.post('http://localhost:5000/api/authority/publish-notification', this.notification, this.headers).subscribe({
      next: () => {
        alert('Notification published successfully!');
        this.notification = { title: '', message: '', targetRole: 'all', type: 'general' };
        this.publishing = false;
      },
      error: () => {
        alert('Failed to publish notification');
        this.publishing = false;
      }
    });
  }
}
