import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';

@Component({
    selector: 'app-attendance',
    standalone: true,
    imports: [CommonModule, SidebarComponent, TopbarComponent],
    template: `<div class="dashboard-layout"><app-sidebar [role]="'student'"></app-sidebar><div class="main-content"><app-topbar [pageTitle]="'Attendance'"></app-topbar><main class="page-content"><h2>Attendance View</h2><p>Working on porting the calendar view...</p></main></div></div>`,
    styles: []
})
export class AttendanceComponent { }
