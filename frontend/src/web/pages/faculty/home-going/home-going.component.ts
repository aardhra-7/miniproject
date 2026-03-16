import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'web-faculty-home-going',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  templateUrl: './home-going.component.html',
  styleUrls: ['./home-going.component.css']
})
export class FacultyHomeGoingComponent implements OnInit {
  user: any;
  homeGoingHistory: any[] = [];
  homeGoingForm = { leaveDate: '', returnDate: '', place: '', reason: '' };

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.user = this.auth.userValue;
    this.loadHomeGoings();
  }

  get headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
  }

  loadHomeGoings() {
    this.http.get<any>('http://localhost:5000/api/faculty/home-going', this.headers).subscribe({
      next: (res) => this.homeGoingHistory = res.history || []
    });
  }

  submitHomeGoing() {
    if (!this.homeGoingForm.leaveDate) return alert('Please select leave date');
    this.http.post('http://localhost:5000/api/faculty/home-going', this.homeGoingForm, this.headers).subscribe({
      next: () => {
        alert('Home going recorded successfully');
        this.homeGoingForm = { leaveDate: '', returnDate: '', place: '', reason: '' };
        this.loadHomeGoings();
      },
      error: (err) => alert(err.error?.message || 'Submission failed')
    });
  }
}
