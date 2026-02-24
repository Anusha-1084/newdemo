import { Component ,OnInit} from '@angular/core';
import { RouterModule } from '@angular/router'; // To enable the router outlet
import { MatSidenavModule } from '@angular/material/sidenav'; // For the layout structure
import { MatToolbarModule } from '@angular/material/toolbar'; // For the header toolbar
import { MatButtonModule } from '@angular/material/button'; // For any buttons in the layout
import { MatIconModule } from '@angular/material/icon'; // For icons in the toolbar
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponentComponent } from 'src/app/modules/student/components/sidebar-component/sidebar-component.component';
import { ReminderNotifierService } from 'src/app/modules/reminders/reminder-notifier.service';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule, 
    MatSidenavModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    FooterSectionComponent,
    NavbarComponent,
    SidebarComponentComponent,
   
    ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'] 
})
export class LayoutComponent implements OnInit {
  isSidebarOpen = false;
  constructor(private reminderNotifier: ReminderNotifierService) {}
  ngOnInit(): void {
    this.reminderNotifier.initReminderPolling();
  }
  toggleSidebar(){
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}


// import { Component, OnInit } from '@angular/core';
// import { Router, RouterModule, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; // Combined router imports
// import { CommonModule } from '@angular/common'; // For ngIf, etc.

// // Material Design Modules
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // For logout feedback

// // Existing UI Components
// import { FooterSectionComponent } from '../footer-section/footer-section.component';
// import { NavbarComponent } from '../navbar/navbar.component';
// // Assuming SidebarComponentComponent is correctly located relative to LayoutComponent
// import { SidebarComponentComponent } from 'src/app/modules/student/components/sidebar-component/sidebar-component.component';

// // Services
// import { ReminderNotifierService } from 'src/app/modules/reminders/reminder-notifier.service';
// import { TokenService } from 'src/app/core/services/tokenservice/token.service';


// @Component({
//   selector: 'app-layout',
//   standalone: true,
//   imports: [
//     // Angular Router Modules
//     RouterModule, // Provides router directives like routerLink
//     RouterOutlet, // Enables rendering of child routes
//     RouterLink, // For navigation links
//     RouterLinkActive, // For applying active class to links
//     CommonModule, // For common directives like ngIf, ngFor

//     // Angular Material Modules
//     MatSidenavModule,
//     MatToolbarModule,
//     MatButtonModule,
//     MatIconModule,
//     MatSnackBarModule, // Import the module, not the service

//     // Custom UI Components
//     FooterSectionComponent,
//     NavbarComponent,
//     SidebarComponentComponent,
//   ],
//   templateUrl: './layout.component.html',
//   styleUrls: ['./layout.component.scss']
// })
// export class LayoutComponent implements OnInit {
//   isSidebarOpen = false; // State for sidebar visibility
//   username: string | null = null; // To display logged-in user's name

//   constructor(
//     private reminderNotifier: ReminderNotifierService,
//     private tokenService: TokenService,
//     private router: Router,
//     private snackBar: MatSnackBar
//   ) { }

//   ngOnInit(): void {
//     // Initialize reminder polling when the layout component loads
//     this.reminderNotifier.initReminderPolling();

//     // Get and display username if logged in
//     this.username = this.tokenService['getUsername'](); // Ensure this method exists and retrieves username
//   }

//   toggleSidebar(): void {
//     this.isSidebarOpen = !this.isSidebarOpen;
//   }

//   logout(): void {
//     this.tokenService.clearTokens(); // Clear authentication tokens
//     this.snackBar.open('You have been logged out.', 'Close', { duration: 3000, panelClass: ['success-snackbar'] }); // Show logout message
//     this.router.navigate(['/']); // Redirect to the landing page
//   }
// }