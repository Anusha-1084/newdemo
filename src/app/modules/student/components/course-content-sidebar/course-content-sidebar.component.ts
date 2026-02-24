import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '../course-enrollment/courses.service';

interface Lessons{
  name:string,
  duration:number
}
interface Modules {
  section_id:number,
  section_title:string,
  section_size:number,
  section_duration:number,
  lesson:Lessons[]
}

@Component({
  selector: 'app-course-content-sidebar',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './course-content-sidebar.component.html',
  styleUrl: './course-content-sidebar.component.scss'
})
export class CourseContentSidebarComponent{

  
  @Input() course: any;
  
  ngOnit(){
    console.log(this.course);
  }

 idx:number=0;
  title="navbar"
  isNavOpen = false;  

  modules:Modules[]=[{
    section_id: 1,
    section_title: "Introduction to Angular",
    section_size: 5,
    section_duration: 120,
    lesson: [
    {
      name: "What is Angular?",
      duration: 20
    },
    {
      name: "Setting Up the Environment",
      duration: 25
    },
   
  ]
},{
  section_id: 2,
  section_title: "Advanced TypeScript",
  section_size: 4,
  section_duration: 150,
  lesson: [
    {
      name: "TypeScript Basics & Types",
      duration: 30
    },
    {
      name: "Interfaces & Type Aliases",
      duration: 35
    },
    {
      name: "Generics in TypeScript",
      duration: 40
    },
    {
      name: "Decorators & Advanced Features",
      duration: 45
    }
  ]
}
    
  ]

  isLessonsVisible: { [key: number]: boolean } = {};
  
  
  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
  }

  
  toggleLessons(sectionId: number) {
    this.isLessonsVisible[sectionId] = !this.isLessonsVisible[sectionId];
  }
}
