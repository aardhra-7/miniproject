import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'web-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  isLoading = false;
  error = '';
  success = '';
  showPassword = false;
  showConfirmPassword = false;

  passwordStrength: 'Weak' | 'Medium' | 'Strong' = 'Weak';

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

    this.resetForm.get('password')?.valueChanges.subscribe(val => {
      this.passwordStrength = this.checkStrength(val);
    });
  }

  checkStrength(p: string): 'Weak' | 'Medium' | 'Strong' {
    if (!p) return 'Weak';
    const hasLetters = /[a-zA-Z]/.test(p);
    const hasNumbers = /[0-9]/.test(p);
    const hasScl = /[!@#$%^&*(),.?":{}|<>]/.test(p);
    const len = p.length;

    if (len >= 8 && hasLetters && hasNumbers && hasScl) return 'Strong';
    if (len >= 6 && (hasLetters || hasNumbers)) {
      if (hasLetters && hasNumbers) return 'Medium';
      return 'Weak';
    }
    return 'Weak';
  }

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordStrength === 'Weak') {
      this.error = 'Password must be at least Medium strength.';
      return;
    }
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
