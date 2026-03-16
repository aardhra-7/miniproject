import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'web-student-profile',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  user: any;

  constructor(private auth: AuthService, private http: HttpClient) { }

  ngOnInit() {
    this.loadProfile();
  }

  get initials(): string {
    return this.user?.name?.split(' ').map((n: any) => n[0]).join('').toUpperCase().substring(0, 2) || 'S';
  }

  loadProfile() {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` });
    this.http.get<any>('http://localhost:5000/api/student/profile', { headers }).subscribe({
      next: (res) => this.user = res.user,
      error: () => { }
    });
  }
}
