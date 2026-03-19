import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'web-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, TopbarComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  filtered: any[] = [];
  search = '';
  roleFilter = '';
  showModal = false;
  editMode = false;
  editId = '';
  userForm: FormGroup;
  saving = false;
  saveError = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private auth: AuthService) {
    this.userForm = this.fb.group({
      userId: [{ value: '', disabled: true }, Validators.required],
      name: ['', Validators.required],
      role: ['student', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: [''],
      // Common extended fields
      department: [''],
      dateOfBirth: [''],
      bloodGroup: [''],
      hostelName: [''],
      collegeName: [''],
      // Student fields
      admissionNo: [''],
      roomNumber: [''],
      semester: [''],
      dateOfAdmission: [''],
      guardiansName: [''],
      guardiansPhone: [''],
      address: ['']
    });

    // Auto-generate User ID
    this.userForm.get('role')?.valueChanges.subscribe(() => this.updateGeneratedUserId());
    this.userForm.get('phone')?.valueChanges.subscribe(() => this.updateGeneratedUserId());
    this.userForm.get('admissionNo')?.valueChanges.subscribe(() => this.updateGeneratedUserId());
  }

  updateGeneratedUserId() {
    if (this.editMode) return;
    const role = this.userForm.get('role')?.value;
    const phone = this.userForm.get('phone')?.value || '';
    const admissionNo = this.userForm.get('admissionNo')?.value || '';

    let generatedId = '';
    if (role === 'student') {
      if (admissionNo) generatedId = `STU-${admissionNo}`;
    } else if (role === 'faculty') {
      if (phone.length >= 4) generatedId = `FAC-${phone.slice(-4)}`;
    } else if (role === 'authority') {
      if (phone.length >= 4) generatedId = `AUTH-${phone.slice(-4)}`;
    } else if (role === 'admin') {
      if (phone.length >= 4) generatedId = `ADM-${phone.slice(-4)}`;
    }

    this.userForm.get('userId')?.setValue(generatedId);
  }


  ngOnInit() { this.loadUsers(); }

  get headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.userValue?.token}` }) };
  }

  loadUsers() {
    const q = this.roleFilter ? `?role=${this.roleFilter}` : '';
    this.http.get<any>(`http://localhost:5000/api/admin/users${q}`, this.headers).subscribe({
      next: r => { this.users = r.users || []; this.filterUsers(); },
      error: () => { }
    });
  }

  filterUsers() {
    const s = this.search.toLowerCase();
    this.filtered = this.users.filter(u =>
      (!this.roleFilter || u.role === this.roleFilter) &&
      (!s || u.name?.toLowerCase().includes(s) || u.userId?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s))
    );
  }

  openAddModal() {
    this.editMode = false;
    this.editId = '';
    this.userForm.reset({ role: 'student' });
    this.userForm.get('password')?.setValidators(Validators.required);
    this.userForm.get('userId')?.disable();
    this.saveError = '';
    this.showModal = true;
  }

  openEdit(u: any) {
    this.editMode = true;
    this.editId = u._id;
    this.userForm.patchValue(u);
    // Format dates for input[type=date]
    if (u.dateOfBirth) {
      this.userForm.patchValue({ dateOfBirth: new Date(u.dateOfBirth).toISOString().split('T')[0] });
    }
    if (u.dateOfAdmission) {
      this.userForm.patchValue({ dateOfAdmission: new Date(u.dateOfAdmission).toISOString().split('T')[0] });
    }
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('userId')?.disable();
    this.saveError = '';
    this.showModal = true;
  }


  saveUser() {
    if (this.userForm.invalid) return;
    this.saving = true;
    this.saveError = '';
    const data = this.userForm.getRawValue();

    const req = this.editMode
      ? this.http.put(`http://localhost:5000/api/admin/users/${this.editId}`, data, this.headers)
      : this.http.post('http://localhost:5000/api/admin/users/create', data, this.headers);

    req.subscribe({
      next: () => {
        this.showModal = false;
        this.saving = false;
        this.loadUsers();
      },
      error: err => {
        this.saveError = err.error?.message || 'Failed to save user.';
        this.saving = false;
      }
    });
  }

  deleteUser(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.http.delete(`http://localhost:5000/api/admin/users/${id}`, this.headers).subscribe({
      next: () => this.loadUsers(),
      error: () => alert('Failed to delete user.')
    });
  }
}
