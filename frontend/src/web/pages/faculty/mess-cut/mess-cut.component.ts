import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'web-faculty-mess-cut',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  templateUrl: './mess-cut.component.html',
  styleUrls: ['./mess-cut.component.css']
})
export class FacultyMessCutComponent implements OnInit {
  user: any;
  messCutHistory: any[] = [];
  messCutForm = { startDate: '', endDate: '', reason: '' };

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.user = this.auth.userValue;
    this.loadMessCuts();
  }

  get headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
  }

  loadMessCuts() {
    this.http.get<any>('http://localhost:5000/api/faculty/mess-cut', this.headers).subscribe({
      next: (res) => this.messCutHistory = res.history || []
    });
  }

  submitMessCut() {
    if (!this.messCutForm.startDate || !this.messCutForm.endDate) return alert('Please select dates');
    this.http.post('http://localhost:5000/api/faculty/mess-cut', this.messCutForm, this.headers).subscribe({
      next: () => {
        alert('Mess cut request submitted successfully');
        this.messCutForm = { startDate: '', endDate: '', reason: '' };
        this.loadMessCuts();
      },
      error: (err) => alert(err.error?.message || 'Submission failed')
    });
  }
}
