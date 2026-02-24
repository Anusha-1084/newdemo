import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/core/services/apiservice/api.service';

@Component({
  selector: 'app-create-lessons',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-lessons.component.html',
  styleUrl: './create-lessons.component.scss'
})
export class CreateLessonsComponent {
  lessonForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,

  ) {
    this.lessonForm = this.fb.group({
      name: ['', Validators.required],
    });

    const savedData = this.apiService.getLessonData();
    if (savedData) {
      this.lessonForm.patchValue(savedData);
    }

  }

  submitForm(){
   this.apiService.createLesson(this.lessonForm.value).subscribe(response => {
     console.log('Lesson Created: ', response);
     alert('Course and Lessons Created Successfully!');
     this.router.navigate(['/instructor-layout/course-creation']);
   })
  }

  onPrevious() {
    this.router.navigate(['/instructor-layout/create-module']);
  }
}
