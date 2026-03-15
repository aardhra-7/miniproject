import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';

@Component({
    selector: 'app-mess-cut',
    standalone: true,
    imports: [CommonModule, SidebarComponent, TopbarComponent],
    template: `<div class="dashboard-layout"><app-sidebar [role]="'student'"></app-sidebar><div class="main-content"><app-topbar [pageTitle]="'Mess Cut Request'"></app-topbar><main class="page-content"><h2>Mess Cut</h2><p>Request mess cut here.</p></main></div></div>`,
    styles: []
})
export class MessCutComponent { }
