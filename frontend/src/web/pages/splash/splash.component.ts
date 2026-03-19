import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'web-splash',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent {
  constructor(private router: Router) { }

  getStarted() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          this.router.navigate(['/role-select']);
        },
        (err) => {
          // If declined or error, stay on splash page or alert 
          console.warn("Location declined or error", err);
          // The user mentioned: "if decline is clicked stay on the role selection page itself"
          // This is a bit ambiguous. I'll stay on splash for now as it makes more sense as a gate.
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      this.router.navigate(['/role-select']);
    }
  }

}
