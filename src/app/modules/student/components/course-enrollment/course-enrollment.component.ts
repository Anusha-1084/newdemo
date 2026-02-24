import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { CoursesService } from './courses.service';
import { error } from 'console';

// Define an interface for the course object
interface Course {
  id: number;
  name: string;
  description: string;
}

@Component({
  standalone: true,
  selector: 'app-course-page',
  templateUrl: './course-enrollment.component.html',
  styleUrls: ['./course-enrollment.component.scss'],
  imports: [CommonModule, RouterModule], // Include RouterModule in the imports array
})
export class CourseEnrollmentComponent implements OnInit {
  selectedTab: string = 'all';
  courses: any[] = [];
  filteredCourses: any[] = [];

  constructor(private courseService :CoursesService) {}

  ngOnInit() {

    this.loadCourses();
       
  }

  onTabClick(tab: string) {
    this.selectedTab = tab;
    this.filterCourses();
  }
  loadCourses():void{
    this.courseService.getCourses()
    .subscribe({
      next:(data)=>{
        this.courses=data;
        this.filterCourses();
      },
      error:(error)=>{
        console.log('Error fetching courses',error);
      }
  })
  }
  private filterCourses() {
    this.filteredCourses = this.courses; // No category filtering, show all courses
  }

    goToCourseContent(course:any){
      this.courseService.setCourse(course);
    }
 
}
