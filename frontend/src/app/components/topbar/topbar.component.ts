import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <div class="topbar-left">
        <button class="btn-back" (click)="goBack()">
          <span>←</span> Back
        </button>
        <div class="topbar-title">{{ pageTitle }}</div>
      </div>
      <div class="topbar-actions">
        <button class="btn-icon">
          <span>🔔</span>
          <span class="notif-dot"></span>
        </button>
        <div class="user-chip">
          <div class="avatar">{{ userInitials }}</div>
          <span class="user-chip-name">{{ userName }}</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      background: var(--card);
      border-bottom: 1px solid var(--border);
      padding: 0 28px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 90;
      box-shadow: 0 1px 3px rgba(0, 0, 0, .06);
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .btn-back {
      background: var(--bg);
      border: 1px solid var(--border);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      color: var(--muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all .2s;
    }

    .btn-back:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    .topbar-title {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--text);
    }

    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      border: none;
      background: var(--bg);
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .notif-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 8px;
      height: 8px;
      background: var(--danger);
      border-radius: 50%;
      border: 2px solid #fff;
    }

    .user-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px 6px 6px;
      background: var(--bg);
      border-radius: 24px;
      cursor: pointer;
    }

    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      font-size: 12px;
    }

    .user-chip-name {
      font-size: 13px;
      font-weight: 600;
    }
  `]
})
export class TopbarComponent {
  @Input() pageTitle: string = 'Dashboard';
  @Input() userName: string = 'User';

  constructor(private location: Location) { }

  get userInitials(): string {
    return this.userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  goBack() {
    this.location.back();
  }
}
