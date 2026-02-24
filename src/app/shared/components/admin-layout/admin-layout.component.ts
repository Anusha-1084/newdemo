import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { AdminNavbarComponent } from 'src/app/modules/admin/components/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from 'src/app/modules/admin/components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [FooterSectionComponent,RouterModule,AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

  isSidebarOpen = false;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
