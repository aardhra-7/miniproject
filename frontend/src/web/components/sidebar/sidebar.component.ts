import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'web-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() role: string = 'student';

  constructor(private authService: AuthService, private router: Router) { }

  get userName(): string {
    return this.authService.userValue?.name || 'User';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/splash']);
  }
}
