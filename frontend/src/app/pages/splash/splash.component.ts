import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-splash',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="splash-container">
      <div class="splash-content">
        <div class="splash-emoji">🏠</div>
        <div class="splash-logo">Stay<span>Sphere</span></div>
        <div class="splash-sub">Smart Hostel Management System</div>
        <div class="splash-tagline">GOVERNMENT ENGINEERING COLLEGE IDUKKI</div>
        <button class="btn-splash" (click)="getStarted()">Get Started →</button>
      </div>
    </div>
  `,
    styles: [`
    .splash-container {
      height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1a56db 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }

    .splash-container::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 30% 70%, rgba(14, 165, 233, .2) 0%, transparent 60%),
                  radial-gradient(circle at 80% 20%, rgba(139, 92, 246, .15) 0%, transparent 50%);
    }

    .splash-content {
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .splash-emoji {
      font-size: 80px;
      margin-bottom: 16px;
    }

    .splash-logo {
      font-family: 'Outfit', sans-serif;
      font-size: 52px;
      font-weight: 800;
      color: #fff;
      letter-spacing: -1px;
    }

    .splash-logo span {
      color: #60a5fa;
    }

    .splash-sub {
      color: rgba(255, 255, 255, .7);
      font-size: 15px;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-top: 8px;
    }

    .splash-tagline {
      color: rgba(255, 255, 255, .5);
      font-size: 13px;
      margin-top: 6px;
    }

    .btn-splash {
      background: linear-gradient(135deg, #1a56db, #0ea5e9);
      color: #fff;
      border: none;
      padding: 16px 48px;
      border-radius: 50px;
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 40px;
      box-shadow: 0 8px 32px rgba(26, 86, 219, .4);
      transition: transform .2s, box-shadow .2s;
    }

    .btn-splash:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(26, 86, 219, .5);
    }
  `]
})
export class SplashComponent {
    constructor(private router: Router) { }

    getStarted() {
        this.router.navigate(['/role-select']);
    }
}
