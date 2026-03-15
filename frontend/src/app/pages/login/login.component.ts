import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-logo">Stay<span>Sphere</span></div>
        <div class="role-badge">{{ role | titlecase }}</div>
        <div class="login-title">Welcome Back</div>
        <div class="login-sub">Sign in to access your dashboard</div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>User ID</label>
            <input class="form-control" formControlName="userId" type="text" placeholder="Enter your User ID" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input class="form-control" formControlName="password" type="password" placeholder="Enter your password" />
            <div class="forgot" (click)="showForgotModal = true">Reset Password?</div>
          </div>
          <div *ngIf="errorMessage" class="error-msg">{{ errorMessage }}</div>
          <button class="btn-login" type="submit" [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Logging in...' : 'Login →' }}
          </button>
        </form>

        <div *ngIf="role === 'admin'" class="admin-reg">
          <a routerLink="/register-admin">Admin Registration</a>
        </div>
        
        <button class="btn-back" (click)="goBack()">← Back to Role Selection</button>
      </div>

      <!-- Forgot Password Modal -->
      <div class="modal-overlay" *ngIf="showForgotModal">
        <div class="modal">
          <h3>Reset Password</h3>
          <p>Enter your registered email to receive a reset link.</p>
          <input type="email" class="form-control" [(ngModel)]="resetEmail" [ngModelOptions]="{standalone: true}" placeholder="Enter your email" />
          <div *ngIf="resetMsg" [class.error-msg]="isResetError" [class.success-msg]="!isResetError">{{ resetMsg }}</div>
          <div class="modal-actions">
            <button class="btn-back" (click)="showForgotModal = false">Cancel</button>
            <button class="btn-login" (click)="onForgotSubmit()" [disabled]="!resetEmail">Send Link</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ... existing styles ... */
    .admin-reg {
      text-align: center;
      margin-top: 16px;
      font-size: 13px;
    }
    .admin-reg a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
    }
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal {
      background: var(--card);
      padding: 32px;
      border-radius: 20px;
      max-width: 400px;
      width: 90%;
    }
    .modal h3 { margin-bottom: 8px; font-weight: 700; }
    .modal p { color: var(--muted); font-size: 14px; margin-bottom: 20px; }
    .modal-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; }
    .success-msg { color: var(--success); font-size: 13px; margin: 10px 0; }
    
    /* Copy over the rest of the styles from original... */
    .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); }
    .login-card { background: var(--card); border-radius: 24px; padding: 40px; width: 100%; max-width: 420px; box-shadow: var(--shadow); }
    .login-logo { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 800; color: var(--primary); margin-bottom: 4px; }
    .login-logo span { color: var(--accent); }
    .role-badge { display: inline-block; background: var(--primary-light); color: var(--primary); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 24px; text-transform: uppercase; letter-spacing: .5px; }
    .login-title { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
    .login-sub { color: var(--muted); font-size: 13px; margin-bottom: 28px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
    .form-control { width: 100%; padding: 12px 16px; border: 2px solid var(--border); border-radius: 12px; font-size: 14px; outline: none; transition: border-color .2s; }
    .form-control:focus { border-color: var(--primary); }
    .forgot { text-align: right; font-size: 12px; color: var(--primary); cursor: pointer; margin-top: 6px; }
    .btn-login { width: 100%; background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; border: none; padding: 14px; border-radius: 12px; font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; transition: opacity .2s; margin-top: 10px; }
    .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
    .btn-back { width: 100%; background: transparent; border: 2px solid var(--border); color: var(--muted); padding: 12px; border-radius: 12px; font-size: 14px; cursor: pointer; margin-top: 16px; transition: all .2s; }
    .btn-back:hover { border-color: var(--primary); color: var(--primary); }
    .error-msg { color: var(--danger); font-size: 13px; margin-bottom: 10px; }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  role: string = 'student';
  isLoading = false;
  errorMessage = '';

  showForgotModal = false;
  resetEmail = '';
  resetMsg = '';
  isResetError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.role = localStorage.getItem('selectedRole') || 'student';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.authService.login({ ...this.loginForm.value, role: this.role }).subscribe({
        next: () => this.router.navigate([`/${this.role}`]),
        error: (err) => {
          this.errorMessage = err.error?.message || 'Login failed.';
          this.isLoading = false;
        }
      });
    }
  }

  onForgotSubmit() {
    this.authService.forgotPassword(this.resetEmail).subscribe({
      next: (res) => {
        this.resetMsg = 'Success! Reset link sent to your email.';
        this.isResetError = false;
        console.log('Mock Token:', res.token);
      },
      error: (err) => {
        this.resetMsg = err.error?.message || 'Email not found.';
        this.isResetError = true;
      }
    });
  }

  goBack() {
    this.router.navigate(['/role-select']);
  }
}
