import { Component } from '@angular/core';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { InstructorNavbarComponent } from 'src/app/modules/instructor/component/instructor-navbar/instructor-navbar.component';
import { InstructorSidebarComponent } from 'src/app/modules/instructor/component/instructor-sidebar/instructor-sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-instructor-layout',
  standalone: true,
  imports: [
    FooterSectionComponent,
    InstructorNavbarComponent,
    InstructorSidebarComponent,
    RouterModule
  ],
  templateUrl: './instructor-layout.component.html',
  styleUrl: './instructor-layout.component.scss'
})
export class InstructorLayoutComponent {
  isSidebarOpen = false;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
 