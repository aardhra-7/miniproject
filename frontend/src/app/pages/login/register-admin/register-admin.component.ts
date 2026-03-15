import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="reg-page">
      <div class="reg-card">
        <h3>Admin Registration</h3>
        <p>Create a new administrator account. Only one admin is allowed per hostel.</p>
        
        <form [formGroup]="regForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name</label>
            <input class="form-control" formControlName="name" placeholder="John Doe" />
          </div>
          <div class="form-group">
            <label>User ID</label>
            <input class="form-control" formControlName="userId" placeholder="ADM-001" />
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" class="form-control" formControlName="email" placeholder="admin@gec.edu" />
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input class="form-control" formControlName="phone" placeholder="9876543210" />
          </div>
          <div class="form-group">
            <label>Hostel Name *</label>
            <input class="form-control" formControlName="hostelName" placeholder="e.g., MH-1, LH-2, Boys Hostel" />
            <span class="hint">Only one admin can be registered per hostel.</span>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" formControlName="password" placeholder="••••••••" />
          </div>
          
          <div *ngIf="error" class="error-msg">{{ error }}</div>
          <div *ngIf="success" class="success-msg">{{ success }}</div>
          
          <button class="btn-reg" type="submit" [disabled]="regForm.invalid || isLoading">
            {{ isLoading ? 'Registering...' : 'Register Administrator' }}
          </button>
        </form>
        
        <button class="btn-back" routerLink="/login">← Back to Login</button>
      </div>
    </div>
  `,
  styles: [`
    .reg-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); padding: 20px; }
    .reg-card { background: var(--card); border-radius: 24px; padding: 40px; width: 100%; max-width: 480px; box-shadow: var(--shadow); }
    h3 { font-weight: 800; margin-bottom: 4px; }
    p { color: var(--muted); font-size: 14px; margin-bottom: 32px; line-height: 1.5; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
    .form-control { width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: 12px; outline: none; transition: border-color .2s; font-size: 14px; background: var(--bg); color: var(--text); }
    .form-control:focus { border-color: var(--primary); }
    .hint { display: block; font-size: 11px; color: var(--muted); margin-top: 5px; }
    .btn-reg { width: 100%; background: var(--primary); color: #fff; border: none; padding: 14px; border-radius: 12px; font-weight: 600; margin-top: 12px; cursor: pointer; }
    .btn-reg:disabled { opacity: .7; cursor: not-allowed; }
    .btn-back { width: 100%; background: transparent; border: 2px solid var(--border); color: var(--muted); padding: 12px; border-radius: 12px; margin-top: 16px; cursor: pointer; }
    .error-msg { color: var(--danger, #dc2626); font-size: 13px; margin-top: 10px; background: #fee2e2; padding: 10px; border-radius: 8px; }
    .success-msg { color: var(--success, #059669); font-size: 13px; margin-top: 10px; background: #dcfce7; padding: 10px; border-radius: 8px; }
  `]
})
export class RegisterAdminComponent {
  regForm: FormGroup;
  isLoading = false;
  error = '';
  success = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.regForm = this.fb.group({
      userId: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      hostelName: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.regForm.valid) {
      this.isLoading = true;
      this.error = '';
      this.auth.registerAdmin(this.regForm.value).subscribe({
        next: () => {
          this.success = 'Registration successful! Redirecting...';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Registration failed.';
          this.isLoading = false;
        }
      });
    }
  }
}
