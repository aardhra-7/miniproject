import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'web-role-selection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './role-selection.component.html',
  styleUrls: ['./role-selection.component.css']
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
