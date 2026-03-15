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
        <h3>Change Password</h3>
        <p>Enter your new password below.</p>
        
        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>New Password</label>
            <input type="password" class="form-control" formControlName="password" placeholder="••••••••" />
          </div>
          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" class="form-control" formControlName="confirmPassword" placeholder="••••••••" />
          </div>
          
          <div *ngIf="error" class="error-msg">{{ error }}</div>
          <div *ngIf="success" class="success-msg">{{ success }}</div>
          
          <button class="btn-reset" type="submit" [disabled]="resetForm.invalid || isLoading">
            {{ isLoading ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .reset-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); }
    .reset-card { background: var(--card); border-radius: 24px; padding: 40px; width: 100%; max-width: 400px; box-shadow: var(--shadow); }
    h3 { font-weight: 800; margin-bottom: 8px; }
    p { color: var(--muted); font-size: 14px; margin-bottom: 24px; }
    .form-group { margin-bottom: 20px; }
    .btn-reset { width: 100%; background: var(--primary); color: #fff; border: none; padding: 14px; border-radius: 12px; font-weight: 600; cursor: pointer; }
  `]
})
export class ResetPasswordComponent implements OnInit {
    resetForm: FormGroup;
    token: string = '';
    isLoading = false;
    error = '';
    success = '';

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
            this.auth.resetPassword(this.token, this.resetForm.value.password).subscribe({
                next: () => {
                    this.success = 'Password changed! Redirecting...';
                    setTimeout(() => this.router.navigate(['/login']), 2000);
                },
                error: (err) => {
                    this.error = err.error?.message || 'Failed to reset password.';
                    this.isLoading = false;
                }
            });
        }
    }
}
