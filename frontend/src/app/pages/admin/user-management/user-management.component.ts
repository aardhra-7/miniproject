import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="dashboard-layout">
      <app-sidebar [role]="'admin'"></app-sidebar>
      <div class="main-content">
        <app-topbar [pageTitle]="'User Management'"></app-topbar>
        <main class="page-content">

          <div class="page-header">
            <h1>User Management</h1>
            <p>Add, edit, and manage all system users by role.</p>
            <button class="btn-primary" (click)="openAddModal()">+ Add User</button>
          </div>

          <!-- Search + Filter -->
          <div class="filter-bar">
            <input class="form-control search" [(ngModel)]="search" placeholder="🔍 Search by name, ID or email..." (input)="filterUsers()" />
            <select class="form-control" [(ngModel)]="roleFilter" (change)="filterUsers()">
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="authority">Authority</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <!-- Users Table -->
          <div class="card">
            <table class="table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Dept / Room</th>
                  <th>Hostel</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="filtered.length === 0">
                  <td colspan="7" class="empty-td">No users found.</td>
                </tr>
                <tr *ngFor="let u of filtered">
                  <td class="mono">{{ u.userId }}</td>
                  <td>{{ u.name }}</td>
                  <td><span [class]="'role-badge role-' + u.role">{{ u.role | titlecase }}</span></td>
                  <td>{{ u.email || '—' }}</td>
                  <td>{{ u.department || u.roomNumber || '—' }}</td>
                  <td>{{ u.hostelName || '—' }}</td>
                  <td>
                    <button class="btn-icon edit" (click)="openEdit(u)">✏️</button>
                    <button class="btn-icon delete" (click)="deleteUser(u._id)">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Add/Edit Modal -->
          <div class="modal-overlay" *ngIf="showModal">
            <div class="modal">
              <div class="modal-header">
                <h3>{{ editMode ? 'Edit User' : 'Add New User' }}</h3>
                <button class="btn-close" (click)="showModal = false">×</button>
              </div>
              
              <form [formGroup]="userForm" (ngSubmit)="saveUser()">
                <div class="form-section">
                  <h4>Basic Information</h4>
                  <div class="form-row">
                    <div class="form-group">
                      <label>User ID *</label>
                      <input class="form-control" formControlName="userId" [readonly]="editMode" placeholder="e.g., ADM101" />
                    </div>
                    <div class="form-group">
                      <label>Full Name *</label>
                      <input class="form-control" formControlName="name" placeholder="Enter full name" />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Role *</label>
                      <select class="form-control" formControlName="role">
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="authority">Authority</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Email *</label>
                      <input type="email" class="form-control" formControlName="email" placeholder="email@example.com" />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Phone *</label>
                      <input class="form-control" formControlName="phone" placeholder="Phone number" />
                    </div>
                    <div class="form-group" *ngIf="!editMode">
                      <label>Password *</label>
                      <input type="password" class="form-control" formControlName="password" placeholder="Initial password" />
                    </div>
                  </div>
                </div>

                <!-- Common Extended Fields -->
                <div class="form-section">
                  <h4>Additional Information</h4>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Department</label>
                      <input class="form-control" formControlName="department" placeholder="e.g., CSE, EEE" />
                    </div>
                    <div class="form-group">
                      <label>Date of Birth</label>
                      <input type="date" class="form-control" formControlName="dateOfBirth" />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Blood Group</label>
                      <select class="form-control" formControlName="bloodGroup">
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>College Name</label>
                      <input class="form-control" formControlName="collegeName" placeholder="e.g., GEC Palakkad" />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Hostel Name</label>
                      <input class="form-control" formControlName="hostelName" placeholder="e.g., MH-1, LH-2" />
                    </div>
                    <div class="form-group" *ngIf="userForm.get('role')?.value === 'faculty'">
                      <label>Room Number (Faculty)</label>
                      <input class="form-control" formControlName="roomNumber" placeholder="e.g., F-201" />
                    </div>
                  </div>
                </div>

                <!-- Student Specific Information -->
                <div *ngIf="userForm.get('role')?.value === 'student'" class="form-section">
                  <h4>Student Details</h4>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Admission No</label>
                      <input class="form-control" formControlName="admissionNo" />
                    </div>
                    <div class="form-group">
                      <label>Date of Admission</label>
                      <input type="date" class="form-control" formControlName="dateOfAdmission" />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Semester</label>
                      <input class="form-control" formControlName="semester" placeholder="e.g., S6" />
                    </div>
                    <div class="form-group">
                      <label>Room Number</label>
                      <input class="form-control" formControlName="roomNumber" placeholder="e.g., 101" />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Guardian's Name</label>
                      <input class="form-control" formControlName="guardiansName" />
                    </div>
                    <div class="form-group">
                      <label>Guardian's Phone</label>
                      <input class="form-control" formControlName="guardiansPhone" />
                    </div>
                  </div>
                  <div class="form-group full-width">
                    <label>Address</label>
                    <textarea class="form-control" formControlName="address" rows="2"></textarea>
                  </div>
                </div>

                <div *ngIf="saveError" class="error-msg">{{ saveError }}</div>
                
                <div class="modal-actions">
                  <button type="button" class="btn-cancel" (click)="showModal = false">Cancel</button>
                  <button type="submit" class="btn-save" [disabled]="userForm.invalid || saving">
                    {{ saving ? 'Saving...' : 'Save User' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: contents; }
    .page-header { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
    .page-header h1 { font-size: 22px; font-weight: 800; margin-bottom: 2px; }
    .page-header p { color: var(--muted); font-size: 14px; flex: 1 1 100%; }
    .btn-primary { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; border: none; padding: 11px 22px; border-radius: 10px; font-weight: 600; cursor: pointer; }
    .filter-bar { display: flex; gap: 12px; margin-bottom: 20px; }
    .search { flex: 1; }
    .form-control { width: 100%; padding: 10px 14px; border: 2px solid var(--border); border-radius: 10px; font-size: 14px; outline: none; background: var(--bg); color: var(--text); transition: border-color .2s; }
    .form-control:focus { border-color: var(--primary); }
    .card { background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: var(--bg); padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; }
    .table td { padding: 14px 16px; border-top: 1px solid var(--border); font-size: 14px; }
    .table tr:hover td { background: var(--bg); }
    .mono { font-family: monospace; font-size: 13px; }
    .role-badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .role-student { background: rgba(14,165,233,.12); color: #0284c7; }
    .role-faculty { background: rgba(16,185,129,.12); color: #059669; }
    .role-authority { background: rgba(139,92,246,.12); color: #7c3aed; }
    .role-admin { background: rgba(245,158,11,.12); color: #d97706; }
    .btn-icon { background: none; border: none; cursor: pointer; font-size: 16px; padding: 4px 8px; border-radius: 6px; }
    .btn-icon:hover { background: var(--bg); }
    .empty-td { text-align: center; color: var(--muted); padding: 40px !important; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 999; }
    .modal { background: var(--card); border-radius: 20px; padding: 32px; width: 90%; max-width: 680px; max-height: 90vh; overflow-y: auto; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 16px; }
    .modal h3 { font-size: 18px; font-weight: 700; margin: 0; }
    .btn-close { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--muted); }
    .form-section { margin-bottom: 24px; }
    .form-section h4 { font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 16px; text-transform: uppercase; letter-spacing: .5px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 12px; }
    .form-group { margin-bottom: 0; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
    .full-width { grid-column: span 2; }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 12px; border-top: 1px solid var(--border); padding-top: 16px; }
    .btn-cancel { background: transparent; border: 2px solid var(--border); color: var(--muted); padding: 11px 22px; border-radius: 10px; cursor: pointer; font-weight: 600; }
    .btn-save { background: var(--primary); color: #fff; border: none; padding: 11px 22px; border-radius: 10px; cursor: pointer; font-weight: 600; }
    .btn-save:disabled { opacity: .7; }
    .error-msg { color: var(--danger); font-size: 13px; margin: 10px 0; }
  `]
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
      userId: ['', Validators.required],
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
    this.userForm.get('userId')?.enable();
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
