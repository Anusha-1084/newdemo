import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

// Auth & User Access
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordPopupComponent } from './auth/forgot-password-popup/forgot-password-popup.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { LoginMainComponent } from './auth/login-main/login-main.component';
import { ContributorsComponent } from './auth/contributors/contributors.component';

// Shared Components
import { LayoutComponent } from './shared/components/layout/layout.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterSectionComponent } from './shared/components/footer-section/footer-section.component';
import { AdminLayoutComponent } from './shared/components/admin-layout/admin-layout.component';
import { InstructorLayoutComponent } from './shared/components/instructor-layout/instructor-layout.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';

// Student Modules
import { HomeSectionComponent } from './modules/student/components/home-section/home-section.component';
import { CourseEnrollmentComponent } from './modules/student/components/course-enrollment/course-enrollment.component';
import { CourseContentComponent } from './modules/student/components/course-content/course-content.component';
import { MyLearningComponent } from './modules/student/components/my-learning/my-learning.component';
import { StudentsAllCoursesComponent } from './modules/student/components/my-learning/my-learning-sub-comonents/students-all-courses/students-all-courses.component';
import { StudentsMyListsComponent } from './modules/student/components/my-learning/my-learning-sub-comonents/students-my-lists/students-my-lists.component';
import { StudentsWishlistComponent } from './modules/student/components/my-learning/my-learning-sub-comonents/students-wishlist/students-wishlist.component';
import { StudentsArchivedComponent } from './modules/student/components/my-learning/my-learning-sub-comonents/students-archived/students-archived.component';
import { StudentsLearningToolsComponent } from './modules/student/components/my-learning/my-learning-sub-comonents/students-learning-tools/students-learning-tools.component';
import { MessagesComponent } from './modules/student/components/sidebar-component/messages/messages.component';
import { EditProfileComponent } from './modules/student/components/sidebar-component/edit-profile/edit-profile.component';
// Admin Modules
import { AdminDashboardComponent } from './modules/admin/admin-dashboard/admin-dashboard.component';
import { ManageCoursesComponent } from './modules/admin/components/manage-courses/manage-courses.component';
import { ManageUsersComponent } from './modules/admin/components/manage-users/manage-users.component';
import { AccountSettingsComponent } from './modules/admin/components/account-settings/account-settings.component';
import { PhotoComponent } from './modules/admin/components/account-settings/photo/photo.component';
import { AccountSecurityComponent } from './modules/admin/components/account-settings/account-security/account-security.component';
import { AdminSidebarComponent } from './modules/admin/components/admin-sidebar/admin-sidebar.component';

// Instructor Modules
import { InstructorDashboardComponent } from './modules/instructor/instructor-dashboard/instructor-dashboard.component';
import { CreateCourseComponent } from './modules/instructor/component/create-course/create-course.component';
import { CreateCourseModulesComponent } from './modules/instructor/component/create-course-modules/create-course-modules.component';
import { CreateLessonsComponent } from './modules/instructor/component/create-lessons/create-lessons.component';

// Timesheet Module
import { TimesheetNavbarComponent } from './modules/Ttimesheet/component/timesheet-navbar/timesheet-navbar.component';
import { HomepageComponent } from './modules/Ttimesheet/component/homepage/homepage.component';
import { AttendanceComponent } from './modules/Ttimesheet/component/attendance/attendance.component';
import { ApproveTimesheetComponent } from './modules/Ttimesheet/component/approve-timesheet/approve-timesheet.component';
import { TimeComponent } from './modules/Ttimesheet/component/time/time.component';
import { TimeLogComponent } from './modules/Ttimesheet/component/time-log/time-log.component';
import { TimesheetComponent } from './modules/Ttimesheet/component/timesheet/timesheet.component';
// Ticketing Module
import { SideNavbarComponent } from './modules/Ticket/components/sideNavbar/sideNavbar.component';
import { RaiseTicketComponent } from './modules/Ticket/components/raise-ticket/raise-ticket.component';
import { MyticketComponent } from './modules/Ticket/components/myticket/myticket.component';
import { UpdateTicketComponent } from './modules/Ticket/components/update-ticket/update-ticket.component';
import { MyTaskNavbarComponent } from './modules/myTask/components/my-task-navbar/my-task-navbar.component';
import { OverViewComponent } from './modules/myTask/components/over-view/over-view.component';
import { TodayOverdueComponent } from './modules/myTask/components/today-overdue/today-overdue.component';
import { TaskAssignedComponent } from './modules/myTask/components/task-assigned/task-assigned.component';


import { ReminderListComponent } from './modules/reminders/reminder-list/reminder-list.component';
import { ReminderFormComponent } from './modules/reminders/reminder-form/reminder-form.component';
import { FileSidebarComponent } from './modules/file/components/layout/file-sidebar/file-sidebar.component';

import { UploadComponent } from './modules/file/components/upload/upload.component';
import { ReceivedComponent } from './modules/file/components/received/received.component';
import { LandingPageComponent } from './modules/meeting/components/landing-page/landing-page.component';
import { ChatSidebarComponent } from './modules/chat/components/chat-sidebar/chat-sidebar.component';
import { DirectmessagesComponent } from './modules/chat/components/directmessages/directmessages.component';
import { ReminderSidebarComponent } from './modules/reminders/reminder-sidebar/reminder-sidebar.component';

//Leave-Management Module
import { NavbarComponentLeaveManagement } from './modules/leave-management/component/navbar-leave-management/navbar-leave-management.component'; 
import { EmployeeDashboardComponent } from './modules/leave-management/component/employee-dashboard/employee-dashboard.component';
import { ApplyLeaveComponent } from './modules/leave-management/component/apply-leave/apply-leave.component';
import {MyRequestsComponent} from './modules/leave-management/component/my-requests/my-requests.component';
import { ReportsComponent } from './modules/leave-management/component/reports/reports.component';
import { ManagerDashboardComponent } from './modules/leave-management/component/manager-dashboard/manager-dashboard.component';
export const routes: Routes = [
  { path: '', redirectTo: '/login-main', pathMatch: 'full' },

  // Auth Routes
  { path: 'login-main', component: LoginMainComponent},
   { path: 'contributors', component: ContributorsComponent },
  { path: 'forgot-password', component: ForgotPasswordPopupComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // Static Component Testing
  { path: 'cyber', component: FooterSectionComponent },

  { path: 'dashboard', component: DashboardComponent },
  // Student Layout
  {
    path: 'layout',
    component: LayoutComponent,
    canActivate: [authGuard, RoleGuard],
    data: { roles: ['ROLE_USER', 'ROLE_MGR', 'ROLE_ADMIN'] },
    children: [
      //{ path: 'reminders',component: ReminderLayoutComponent},
      //{ path: 'reminders',component: ReminderSidebarComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'dashboard', component: HomeSectionComponent },
      { path: 'navbar', component: NavbarComponent },
      { path: 'edit-profile', component: EditProfileComponent },
 
      {
        path: 'meeting-landing',
        loadComponent: () =>
          import(
            './modules/meeting/components/landing-page/landing-page.component'
          ).then((m) => m.LandingPageComponent),
      },
      {
        path: 'meet/:id',
        loadComponent: () =>
          import(
            './modules/meeting/components/video-call/video-call.component'
          ).then((m) => m.VideoCallComponent),
      },

      {
        path: 'schedule-meeting',
        loadComponent: () =>
          import(
            './modules/meeting/components/schedule-meeting/schedule-meeting.component'
          ).then((m) => m.ScheduleMeetingComponent),
      },

      

      {
        path: 'timesheet',
        component: TimesheetNavbarComponent,
        canActivate: [authGuard, RoleGuard],
         data: { roles: ['ROLE_USER', 'ROLE_MGR', 'ROLE_ADMIN'] },
        
        children: [
          { path: '', redirectTo: 'homepage', pathMatch: 'full' },
          { path: 'attendance', component: AttendanceComponent },
          { path: 'myticket', component: MyticketComponent },
          { path: 'homepage', component: HomepageComponent },
          {path: 'approve-timesheet', component: ApproveTimesheetComponent,
            canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN'] }
           },
          {
            path: 'time',
            component: TimeComponent,
            children: [
              { path: '', redirectTo: 'logtime', pathMatch: 'full' },
              { path: 'logtime', component: TimeLogComponent },
              { path: 'sheet', component: TimesheetComponent }
            ]
            }
        ],
      },

      {
        path: 'ticket',
        component: SideNavbarComponent,
        canActivate: [authGuard],
        children: [
          { path: '', component: RaiseTicketComponent },
          { path: 'myticket', component: MyticketComponent },
          { path: 'update-ticket/:id', component: UpdateTicketComponent },
        ],
      },
      {
        path: 'chat',
        component: ChatSidebarComponent,
        canActivate: [authGuard],
        children: [
          { path: '', component: ChatSidebarComponent },
          { path: 'directmessages', component: DirectmessagesComponent },
        ],
      },

      {
        path: 'file',
        component: FileSidebarComponent,
        canActivate: [authGuard],
        children: [
          { path: 'upload', component: UploadComponent },
          { path: 'received', component: ReceivedComponent },
        ],
      },

      {
        path: 'mytask',
        component: MyTaskNavbarComponent,
        canActivate: [authGuard],
        children: [
          { path: '', component: OverViewComponent },
          { path: 'task-today', component: TodayOverdueComponent },
          { path: 'task-assigned', component: TaskAssignedComponent },
        ],
      },

      { path: 'courses', component: CourseEnrollmentComponent },
      { path: 'courses/:id', component: CourseContentComponent },

      {
        path: 'my-learning',
        component: MyLearningComponent,
        canActivate: [authGuard],
        children: [
        
          { path: '', component: StudentsAllCoursesComponent },
          { path: 'my-lists', component: StudentsMyListsComponent },
          { path: 'wishlist', component: StudentsWishlistComponent },
          { path: 'archived', component: StudentsArchivedComponent },
          { path: 'learning-tools', component: StudentsLearningToolsComponent },
        ],
      },

      { path: 'messages', component: MessagesComponent },

      {path: 'leave-management', component: NavbarComponentLeaveManagement,
      children: [
            {path: 'employee-dashboard', component: EmployeeDashboardComponent },
            {path: 'apply-leave', component: ApplyLeaveComponent },
            {path: 'my-requests', component: MyRequestsComponent },
            {path: 'reports', component: ReportsComponent },
            {path: 'manager-dashboard', component: ManagerDashboardComponent },
            { path: '', redirectTo: 'employee-dashboard', pathMatch: 'full' }
          ]
      },

 {
  path: 'reminders',
  component: ReminderSidebarComponent, // Layout with sidebar
  children: [
    { path: 'list',component: ReminderListComponent },
    { path: 'new',component: ReminderFormComponent },
    { path: ':id/edit',component: ReminderFormComponent },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
  ]
}
    ],
  },
  
  // Admin Layout
  {
    path: 'admin-layout',
    component: AdminLayoutComponent,
    canActivate: [authGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] },
    children: [
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'manage-courses', component: ManageCoursesComponent },
      { path: 'manage-users', component: ManageUsersComponent },
      {
        path: 'account-settings',
        component: AccountSettingsComponent,
        children: [
          { path: 'photo', component: PhotoComponent },
          { path: 'account-security', component: AccountSecurityComponent },
        ],
      },
      { path: 'account-side', component: AdminSidebarComponent },
    ],
  },

  // Instructor Layout
  {
    path: 'instructor-layout',
    component: InstructorLayoutComponent,
    canActivate: [authGuard, RoleGuard],
    data: { roles: ['ROLE_INSTRUCTOR'] },
    children: [
      { path: '', component: InstructorDashboardComponent },
      { path: 'create-courses', component: CreateCourseComponent },
      { path: 'create-module', component: CreateCourseModulesComponent },
      { path: 'create-course-lesson', component: CreateLessonsComponent },
    ],
  },

  // Fallback
  { path: '**', redirectTo: '/login' },
];
