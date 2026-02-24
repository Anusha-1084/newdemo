import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminPichartComponent } from '../components/admin-pichart/admin-pichart.component';
import { StudentsPichartComponent } from '../components/students-pichart/students-pichart.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [CommonModule,
    AdminPichartComponent,
    StudentsPichartComponent,
  ]
})
export class AdminDashboardComponent implements OnInit {
  totalCourses: number;
  totalUsers: number;
  monthlyRevenue: number;
  recentActivities: string[];

  constructor() {
  
    this.totalCourses = 120;
    this.totalUsers = 4500;
    this.monthlyRevenue = 12000;
    this.recentActivities = [
      'User John Doe enrolled in "Angular Basics"',
      'New course "Advanced TypeScript" added',
      'User Jane Smith completed "React for Beginners"'
    ];
  }

  ngOnInit(): void {
    
  }
}
