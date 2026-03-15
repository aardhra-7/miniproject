import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-role-selection',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="role-page">
      <div class="role-container">
        <div class="role-header">
          <div class="role-logo">Stay<span>Sphere</span></div>
          <h2>Select Your Role</h2>
          <p>Choose the role that applies to you to continue</p>
        </div>
        <div class="role-grid">
          <div class="role-card" [class.selected]="selectedRole ==='student'" (click)="selectRole('student')">
            <div class="role-icon">🎓</div>
            <div class="role-name">Student</div>
          </div>
          <div class="role-card" [class.selected]="selectedRole === 'faculty'" (click)="selectRole('faculty')">
            <div class="role-icon">👨‍🏫</div>
            <div class="role-name">Faculty</div>
          </div>
          <div class="role-card" [class.selected]="selectedRole === 'authority'" (click)="selectRole('authority')">
            <div class="role-icon">🛡️</div>
            <div class="role-name">Authority</div>
          </div>
          <div class="role-card" [class.selected]="selectedRole === 'admin'" (click)="selectRole('admin')">
            <div class="role-icon">⚙️</div>
            <div class="role-name">Admin</div>
          </div>
        </div>
        <button class="btn-continue" (click)="continue()">Continue →</button>
      </div>
    </div>
  `,
    styles: [`
    .role-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
    }

    .role-container {
      width: 100%;
      max-width: 560px;
      padding: 32px 24px;
    }

    .role-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .role-logo {
      font-family: 'Outfit', sans-serif;
      font-size: 28px;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 8px;
    }

    .role-logo span {
      color: var(--accent);
    }

    .role-header h2 {
      font-size: 22px;
      font-weight: 700;
      color: var(--text);
    }

    .role-header p {
      color: var(--muted);
      font-size: 14px;
      margin-top: 4px;
    }

    .role-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }

    .role-card {
      background: var(--card);
      border: 2px solid var(--border);
      border-radius: var(--radius);
      padding: 28px 20px;
      text-align: center;
      cursor: pointer;
      transition: all .2s;
    }

    .role-card:hover {
      border-color: var(--primary);
      background: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: var(--shadow);
    }

    .role-card.selected {
      border-color: var(--primary);
      background: var(--primary-light);
      box-shadow: 0 0 0 3px rgba(26, 86, 219, .15);
    }

    .role-icon {
      font-size: 36px;
      margin-bottom: 10px;
    }

    .role-name {
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
      font-size: 15px;
      color: var(--text);
    }

    .btn-continue {
      width: 100%;
      background: var(--primary);
      color: #fff;
      border: none;
      padding: 14px;
      border-radius: 12px;
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background .2s;
    }

    .btn-continue:hover {
      background: var(--primary-dark);
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
