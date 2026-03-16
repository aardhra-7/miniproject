import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'web-student-profiles',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  templateUrl: './student-profiles.component.html',
  styleUrls: ['./student-profiles.component.css']
})
export class StudentProfilesComponent implements OnInit {
  students: any[] = [];
  filteredStudents: any[] = [];
  search = '';
  selectedStudent: any = null;

  constructor(private http: HttpClient, private auth: AuthService) { }

  get headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
  }

  ngOnInit() { this.load(); }

  load() {
    this.http.get<any>('http://localhost:5000/api/authority/students', this.headers).subscribe({
      next: res => {
        this.students = res.students || [];
        this.filter();
      }
    });
  }

  filter() {
    const q = this.search.toLowerCase();
    this.filteredStudents = this.students.filter(s =>
      s.name.toLowerCase().includes(q) || s.userId.toLowerCase().includes(q) || s.roomNumber?.includes(q)
    );
  }
}
