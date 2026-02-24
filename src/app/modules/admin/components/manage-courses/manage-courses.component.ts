import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-courses',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './manage-courses.component.html',
  styleUrl: './manage-courses.component.scss'
})
export class ManageCoursesComponent {

  searchTerm: string = '';
  courses = [
    { id: 101, name: 'Java', instructor: 'Mr. Vinod Kalake'},
    { id: 102, name: 'Angular', instructor: 'Mr. Virendra Kumar'},
    { id: 103, name: 'AI', instructor: 'Mr. Anil Kumar'}
  ];
  filteredCourses = [...this.courses];

  onSearch() {
    this.filteredCourses = this.courses.filter(
      (course) =>
        course.id.toString().includes(this.searchTerm) ||
        course.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onView(courseId: number) {
    alert('Viewing details for Course ID: ' + courseId);
  }

  onUpdate(courseId: number) {
    alert('Update in Course ID: ' + courseId);
  }

  onDelete(courseId: number) {
    alert('Deleted Course ID: ' + courseId);
    }
}
