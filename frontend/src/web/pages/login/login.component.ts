import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'web-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  role: string = 'student';
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  passwordStrength: 'Weak' | 'Medium' | 'Strong' | '' = '';
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

    this.loginForm.get('password')?.valueChanges.subscribe(val => {
      this.passwordStrength = val ? this.checkStrength(val) : '';
    });
  }

  checkStrength(p: string): 'Weak' | 'Medium' | 'Strong' {
    if (!p) return 'Weak';
    const hasLetters = /[a-zA-Z]/.test(p);
    const hasNumbers = /[0-9]/.test(p);
    const hasScl = /[!@#$%^&*(),.?":{}|<>]/.test(p);
    const len = p.length;

    if (len >= 8 && hasLetters && hasNumbers && hasScl) return 'Strong';
    if (len >= 6 && hasLetters && hasNumbers) return 'Medium';
    return 'Weak';
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
