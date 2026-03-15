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
    <div class="login-page animate-fade-in">
      <div class="login-card">
        <div class="login-header">
          <div class="login-logo">Stay<span>Sphere</span></div>
          <div class="role-badge">{{ role | titlecase }} Access</div>
        </div>
        
        <div class="login-intro">
          <h2>Welcome Back</h2>
          <p>Login to manage your hostel activities</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label><i class="bi bi-person mr-10"></i> User ID</label>
            <input class="form-control" formControlName="userId" type="text" placeholder="Enter your ID" />
          </div>
          
          <div class="form-group">
            <div class="label-row">
              <label><i class="bi bi-lock mr-10"></i> Password</label>
              <div class="forgot" (click)="showForgotModal = true">Forgot?</div>
            </div>
            <input class="form-control" formControlName="password" type="password" placeholder="••••••••" />
          </div>
          
          <div *ngIf="errorMessage" class="error-msg">
            <i class="bi bi-exclamation-circle"></i> {{ errorMessage }}
          </div>
          
          <button class="primary-btn btn-login" type="submit" [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Authenticating...' : 'Login to Dashboard' }} <i class="bi bi-chevron-right ml-10"></i>
          </button>
        </form>

        <div *ngIf="role === 'admin'" class="admin-reg">
          New hostel? <a routerLink="/register-admin">Register Administrator</a>
        </div>
        
        <button class="btn-back" (click)="goBack()">
          <i class="bi bi-arrow-left"></i> Back to roles
        </button>
      </div>

      <!-- Forgot Password  -->
      <div class="modal-overlay" *ngIf="showForgotModal" (click)="showForgotModal = false">
        <div class="modal animate-fade-in" (click)="$event.stopPropagation()">
          <h3>Reset Password</h3>
          <p>Enter your registered email to receive a secure reset link.</p>
          <div class="form-group mt-20">
             <input type="email" class="form-control" [(ngModel)]="resetEmail" [ngModelOptions]="{standalone: true}" placeholder="yourname@example.com" />
          </div>
          <div *ngIf="resetMsg" [class.error-msg]="isResetError" [class.success-msg]="!isResetError">
            <i class="bi" [class.bi-check-circle]="!isResetError" [class.bi-exclamation-circle]="isResetError"></i> {{ resetMsg }}
          </div>
          <div class="modal-actions">
            <button class="secondary-btn" (click)="showForgotModal = false">Cancel</button>
            <button class="primary-btn" (click)="onForgotSubmit()" [disabled]="!resetEmail">Send Link</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--background);
      padding: 20px;
    }

    .login-card {
      background: var(--card-bg);
      border-radius: 24px;
      padding: 48px 40px;
      width: 100%;
      max-width: 440px;
      box-shadow: var(--shadow-soft);
    }

    .login-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .login-logo {
      font-size: 24px;
      font-weight: 800;
      color: var(--primary);
      font-family: 'Poppins', sans-serif;
    }

    .login-logo span { color: var(--text-dark); }

    .role-badge {
      background: var(--primary-light);
      color: var(--primary-dark);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .login-intro { margin-bottom: 32px; }
    .login-intro h2 { font-size: 24px; color: var(--text-dark); }
    .login-intro p { color: var(--text-light); font-size: 14px; margin-top: 4px; }

    .form-group { margin-bottom: 24px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--text-dark); margin-bottom: 8px; }

    .label-row { display: flex; justify-content: space-between; align-items: center; }
    .forgot { color: var(--primary); font-size: 13px; cursor: pointer; font-weight: 600; }

    .btn-login { width: 100%; margin-top: 10px; padding: 16px; font-size: 16px; }

    .admin-reg {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: var(--text-light);
    }
    .admin-reg a { color: var(--primary); text-decoration: none; font-weight: 600; }

    .btn-back {
      width: 100%;
      background: transparent;
      border: none;
      color: var(--text-light);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 24px;
      transition: color 0.2s;
    }
    .btn-back:hover { color: var(--primary); }

    .error-msg {
      background: #fee2e2;
      color: #dc2626;
      padding: 12px;
      border-radius: 12px;
      font-size: 13px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .success-msg {
      background: #dcfce7;
      color: #16a34a;
      padding: 12px;
      border-radius: 12px;
      font-size: 13px;
      margin-top: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }
    .modal {
      background: var(--card-bg);
      padding: 40px;
      border-radius: 24px;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .modal h3 { font-size: 20px; margin-bottom: 12px; }
    .modal p { color: var(--text-light); font-size: 14px; line-height: 1.6; }
    .modal-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 32px; }
    
    .ml-10 { margin-left: 10px; }
    .mr-10 { margin-right: 10px; }
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
          this.errorMessage = err.error?.message || 'Invalid User ID or Password.';
          this.isLoading = false;
        }
      });
    }
  }

  onForgotSubmit() {
    this.authService.forgotPassword(this.resetEmail).subscribe({
      next: (res) => {
        this.resetMsg = 'Check your inbox! We sent a reset link.';
        this.isResetError = false;
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
