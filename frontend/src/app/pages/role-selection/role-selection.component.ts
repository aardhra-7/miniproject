import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="role-page animate-fade-in">
      <div class="role-container">
        <div class="role-header">
          <div class="role-logo">stay<span>Sphere</span></div>
          <h2>Select Your Role</h2>
          <p>Tell us who you are to access the dashboard</p>
        </div>
        
        <div class="role-grid">
          <div class="role-card" [class.selected]="selectedRole ==='student'" (click)="selectRole('student')">
            <div class="role-icon-box">
              <i class="bi bi-mortarboard-fill"></i>
            </div>
            <div class="role-name">Student</div>
          </div>
          
          <div class="role-card" [class.selected]="selectedRole === 'faculty'" (click)="selectRole('faculty')">
            <div class="role-icon-box">
              <i class="bi bi-person-workspace"></i>
            </div>
            <div class="role-name">Faculty</div>
          </div>
          
          <div class="role-card" [class.selected]="selectedRole === 'authority'" (click)="selectRole('authority')">
            <div class="role-icon-box">
              <i class="bi bi-shield-lock-fill"></i>
            </div>
            <div class="role-name">Authority</div>
          </div>
          
          <div class="role-card" [class.selected]="selectedRole === 'admin'" (click)="selectRole('admin')">
            <div class="role-icon-box">
              <i class="bi bi-gear-fill"></i>
            </div>
            <div class="role-name">Hostel Admin</div>
          </div>
        </div>
        
        <button class="primary-btn btn-continue" (click)="continue()" [disabled]="!selectedRole">
          Continue <i class="bi bi-arrow-right-short"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .role-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--background);
      padding: 20px;
    }

    .role-container {
      width: 100%;
      max-width: 520px;
    }

    .role-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .role-logo {
      font-size: 28px;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 8px;
      font-family: 'Poppins', sans-serif;
    }

    .role-logo span {
      color: var(--text-dark);
    }

    .role-header h2 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-dark);
    }

    .role-header p {
      color: var(--text-light);
      font-size: 14px;
      margin-top: 4px;
    }

    .role-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 32px;
    }

    .role-card {
      background: var(--card-bg);
      border: 2px solid transparent;
      border-radius: 20px;
      padding: 32px 20px;
      text-align: center;
      cursor: pointer;
      transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-soft);
    }

    .role-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.06);
      border-color: var(--primary-light);
    }

    .role-card.selected {
      border-color: var(--primary);
      background: var(--primary-light);
      transform: translateY(-5px);
    }

    .role-icon-box {
      width: 56px;
      height: 56px;
      background: #f3f4f6;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 24px;
      color: var(--text-light);
      transition: all .3s;
    }

    .role-card:hover .role-icon-box {
      background: var(--primary-light);
      color: var(--primary);
    }

    .role-card.selected .role-icon-box {
      background: var(--primary);
      color: white;
    }

    .role-name {
      font-weight: 600;
      font-size: 15px;
      color: var(--text-dark);
    }

    .btn-continue {
      width: 100%;
      padding: 16px;
      font-size: 16px;
    }

    .btn-continue:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  `]
})
export class RoleSelectComponent {
  selectedRole: string | null = null;

  constructor(private router: Router) { }

  selectRole(role: string) {
    this.selectedRole = role;
  }

  continue() {
    if (this.selectedRole) {
      localStorage.setItem('selectedRole', this.selectedRole);
      this.router.navigate(['/login']);
    }
  }
}
