// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.scss'
// })
// export class DashboardComponent {

// }

// src/app/layout/dashboard/dashboard.component.ts
// import { Component, OnInit } from '@angular/core';
// import { TokenService } from 'src/app/core/services/tokenservice/token.service'; // Adjust path
// import { CommonModule } from '@angular/common'; // For NgIf, etc.

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule], // Add CommonModule for directives
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss'],
// })
// export class DashboardComponent implements OnInit {
//   username: string | null = null;

//   constructor(private tokenService: TokenService) {}

//   ngOnInit(): void {
//     this.username = this.tokenService['getUsername'](); // Make sure getUsername() is properly implemented
//   }
// }

// src/app/layout/dashboard/dashboard.component.ts
// src/app/layout/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/core/services/tokenservice/token.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  username: string | null = null;

  // Define your features with their details and router links
  features = [
    {
      title: 'Chat Option',
      description: 'Real-time user-to-user messaging with secure channels.',
      icon: 'https://static.vecteezy.com/system/resources/previews/018/887/298/non_2x/chat-line-icon-png.png',
      routerLink: '/layout/chat', // CORRECTED: This will navigate to /layout/chat
      isMediaRelated: true,
    },
    {
      title: 'Video Call Option',
      description:
        'Seamless video conferencing for effective team collaboration.',
      icon: 'https://thumbs.dreamstime.com/b/virtual-online-work-business-office-video-conference-home-telework-people-sits-computer-distance-videocall-internet-freelance-263029510.jpg',
      routerLink: '/layout/video-call', // This will navigate to /layout/video-call (your 'videomeet' page)
      isMediaRelated: true,
    },
    {
      title: 'File Transfer Option',
      description: 'Securely upload, share, and manage files with ease.',
      icon: 'https://media.istockphoto.com/id/532417235/vector/moving-documents-between-two-folders.jpg?s=612x612&w=0&k=20&c=0JmJcQbWzEmIw-GWX9BCoPQBH-bYb2jui5-w2W3ygSk=',
      routerLink: '/layout/file-transfer', // This will navigate to /layout/file-transfer (your 'file' page)
      isMediaRelated: true,
    },
    {
      title: 'Timesheet Option',
      description:
        'Effortlessly log working hours and manage project schedules.',
      icon: 'https://ignatiuz-timesheet.azurewebsites.net/wp-content/uploads/2024/10/Timesheet-Pro-Icon.png',
      routerLink: '/layout/timesheet', // This will navigate to /layout/timesheet
      isMediaRelated: false,
    },
    {
      title: 'Help Desk Option',
      description:
        'Raise support tickets and access comprehensive documentation.',
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkPg2EOS45e40BIshybnHUwh6nl7Gn_EQauA&s',
      routerLink: '/layout/help-desk', // This will navigate to /layout/help-desk
      isMediaRelated: false,
    },
    {
      title: 'Attendance Option',
      description: 'Daily attendance view and tracking.',
      icon: 'https://tse2.mm.bing.net/th/id/OIP.O_6UfAXU7VwAxtLz0ncjAQHaHW?pid=Api&P=0&h=180',
      routerLink: '/layout/attendance', // This will navigate to /layout/attendance
      isMediaRelated: false,
    },
    {
      title: 'Check-In / Check-Out',
      description: 'Users can mark their start and end time for the day.',
      icon: 'https://www.shutterstock.com/image-vector/checkin-checkout-icon-vector-filled-260nw-574755751.jpg',
      routerLink: '/layout/check-in-out', // This will navigate to /layout/check-in-out
      isMediaRelated: false,
    },
    {
      title: 'Custom Reports',
      description: 'Generate insightful reports to analyze your CRM data.',
      icon: 'https://static.vecteezy.com/system/resources/previews/013/278/884/original/an-editable-design-icon-of-business-report-management-vector.jpg',
      routerLink: '/layout/reports', // This will navigate to /layout/reports
      isMediaRelated: false,
    },
  ];

  constructor(private tokenService: TokenService) {}

  ngOnInit(): void {
    this.username = this.tokenService['getUsername']();
  }
}
