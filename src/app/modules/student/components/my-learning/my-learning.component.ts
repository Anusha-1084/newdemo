import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseEnrollmentComponent } from '../course-enrollment/course-enrollment.component';

@Component({
  selector: 'app-my-learning',
  standalone: true,
  imports: [
    RouterModule,
    CourseEnrollmentComponent,
  ],
  templateUrl: './my-learning.component.html',
  styleUrl: './my-learning.component.scss'
})
export class MyLearningComponent {

}
