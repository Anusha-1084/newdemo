import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CardsComponent } from './cards/cards.component';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule,
    CardsComponent,
    RouterModule
  ],
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.scss'
})
export class InstructorDashboardComponent implements OnInit {
  ngOnInit() {
    console.log('InstructorDashboardComponent initialized');
  }
  constructor(
      private router: Router,
    ){}
    cards = [
      {
        title: 'Create an Engaging Course',
        description:
          'Whether you\'ve been teaching for years or are teaching for the first time, you can make an engaging course.We\'ve compiled resources and best practices to help you get to the next level, no matter where you\'re starting.',
        image: 'https://cdni.iconscout.com/illustration/premium/thumb/boy-doing-exam-preparation-illustration-download-in-svg-png-gif-file-formats--young-man-reading-book-student-happy-studying-pack-school-education-illustrations-6676302.png',
        linkText: 'Get Started',
      },
      {
        title: 'Build Your Audience',
        description:
          'Set your course up for success by building your audience.',
        image: 'https://cdni.iconscout.com/illustration/premium/thumb/boy-doing-exam-preparation-illustration-download-in-svg-png-gif-file-formats--young-man-reading-book-student-happy-studying-pack-school-education-illustrations-6676302.png',
        linkText: 'Get Started',
      }, 
    ];
  
    createCourses(){
      this.router.navigate(['/instructor-layout/create-courses']);
    }

} 
