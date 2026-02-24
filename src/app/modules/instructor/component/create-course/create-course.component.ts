import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/core/services/apiservice/api.service';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.scss'
})
export class CreateCourseComponent {
  courseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiServece: ApiService,
  ) {
    
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
    const saveData = this.apiServece.getCourseData();
    if(saveData){
      this.courseForm.patchValue(saveData);
    }    
  }

  submitForm(){
    this.apiServece.saveCourseData(this.courseForm.value);
    this.router.navigate(['/instructor-layout/create-module']);
  }
  goBack() {
    console.log('Back button clicked');
  }

}
