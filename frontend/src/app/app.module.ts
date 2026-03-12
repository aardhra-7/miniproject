import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Pages
import { SplashComponent } from './pages/splash/splash.component';
import { RoleSelectComponent } from './pages/role-selection/role-selection.component';
import { LoginComponent } from './pages/login/login.component';

// Student
import { StudentDashboardComponent } from './pages/student/dashboard/dashboard.component';
import { StudentProfileComponent } from './pages/student/profile/profile.component';
import { AttendanceComponent } from './pages/student/attendance/attendance.component';
import { MessCutComponent } from './pages/student/mess-cut/mess-cut.component';
import { OutgoingComponent } from './pages/student/outgoing/outgoing.component';
import { HomeGoingComponent } from './pages/student/home-going/home-going.component';
import { ReturnComponent } from './pages/student/return/return.component';

// Admin
import { AdminDashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { UserManagementComponent } from './pages/admin/user-management/user-management.component';

// Authority
import { AuthorityDashboardComponent } from './pages/authority/dashboard/dashboard.component';
import { RequestApprovalComponent } from './pages/authority/request-approval/request-approval.component';

// Faculty
import { FacultyDashboardComponent } from './pages/faculty/dashboard/dashboard.component';

// Shared
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { ToastComponent } from './components/toast/toast.component';

// Guards
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    RoleSelectComponent,
    LoginComponent,
    StudentDashboardComponent,
    StudentProfileComponent,
    AttendanceComponent,
    MessCutComponent,
    OutgoingComponent,
    HomeGoingComponent,
    ReturnComponent,
    AdminDashboardComponent,
    UserManagementComponent,
    AuthorityDashboardComponent,
    RequestApprovalComponent,
    FacultyDashboardComponent,
    SidebarComponent,
    TopbarComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
