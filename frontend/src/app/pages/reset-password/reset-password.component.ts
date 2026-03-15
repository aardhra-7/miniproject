import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="reset-page">
      <div class="reset-card">
        <div class="logo"> stay<span>Sphere</span></div>
        <h3>Reset Password</h3>
        <p>Your security is our priority. Enter a strong new password.</p>
        
        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>New Password</label>
            <div class="input-wrapper">
              <input [type]="showPassword ? 'text' : 'password'" 
                     class="form-control" 
                     formControlName="password" 
                     placeholder="Minimum 6 characters" />
              <button type="button" class="eye-btn" (click)="showPassword = !showPassword">
                {{ showPassword ? '👁️' : '🔒' }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" class="form-control" formControlName="confirmPassword" placeholder="Repeat password" />
          </div>
          
          <div *ngIf="error" class="error-banner">
             <span></span> {{ error }}
          </div>
          <div *ngIf="success" class="success-banner">
             <span></span> {{ success }}
          </div>
          
          <button class="btn-reset" type="submit" [disabled]="resetForm.invalid || isLoading">
            {{ isLoading ? 'Updating Password...' : 'Reset Password →' }}
          </button>
        </form>

        <div class="footer-links">
           <a routerLink="/login">Back to Login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reset-page { 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 20px;
    }
    .reset-card { 
      background: #ffffff; 
      border-radius: 28px; 
      padding: 48px; 
      width: 100%; 
      max-width: 440px; 
      box-shadow: 0 20px 50px rgba(0,0,0,0.08); 
      border: 1px solid rgba(255,255,255,0.7);
    }
    .logo { font-weight: 900; font-size: 20px; color: var(--primary, #0ea5e9); margin-bottom: 24px; }
    h3 { font-size: 24px; font-weight: 800; margin-bottom: 8px; color: #1e293b; }
    p { color: #64748b; font-size: 15px; margin-bottom: 32px; line-height: 1.5; }
    
    .form-group { margin-bottom: 24px; }
    .form-group label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px; color: #475569; }
    
    .input-wrapper { position: relative; }
    .form-control { 
      width: 100%; 
      padding: 14px 16px; 
      border: 2px solid #e2e8f0; 
      border-radius: 14px; 
      font-size: 15px; 
      outline: none; 
      transition: all .2s;
    }
    .form-control:focus { border-color: #0ea5e9; box-shadow: 0 0 0 4px rgba(14,165,233, 0.1); }
    
    .eye-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      padding: 4px;
    }

    .btn-reset { 
      width: 100%; 
      background: linear-gradient(135deg, #0ea5e9, #2563eb); 
      color: #fff; 
      border: none; 
      padding: 16px; 
      border-radius: 14px; 
      font-weight: 700; 
      font-size: 16px;
      cursor: pointer; 
      box-shadow: 0 10px 15px -3px rgba(37,99,235, 0.3);
      transition: all .2s;
    }
    .btn-reset:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 15px 20px -3px rgba(37,99,235, 0.4); }
    .btn-reset:disabled { opacity: .6; cursor: not-allowed; }

    .error-banner { background: #fef2f2; color: #dc2626; padding: 14px; border-radius: 12px; font-size: 14px; font-weight: 600; margin-bottom: 24px; border: 1px solid #fee2e2; }
    .success-banner { background: #f0fdf4; color: #16a34a; padding: 14px; border-radius: 12px; font-size: 14px; font-weight: 600; margin-bottom: 24px; border: 1px solid #dcfce7; }
    
    .footer-links { text-align: center; margin-top: 24px; }
    .footer-links a { color: #0ea5e9; font-weight: 700; font-size: 14px; text-decoration: none; }
    .footer-links a:hover { text-decoration: underline; }
  `]
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  isLoading = false;
  error = '';
  success = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.isLoading = true;
      this.error = '';
      this.success = '';

      this.auth.resetPassword(this.token, this.resetForm.value.password).subscribe({
        next: (res: any) => {
          this.success = res.message || 'Password reset successful! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Invalid or Expired Link. Please request a new link.';
          this.isLoading = false;
        }
      });
    }
  }
}
