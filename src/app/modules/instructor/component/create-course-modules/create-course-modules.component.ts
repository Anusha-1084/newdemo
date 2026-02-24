import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/core/services/apiservice/api.service';

@Component({
  selector: 'app-create-course-modules',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-course-modules.component.html',
  styleUrl: './create-course-modules.component.scss'
})
export class CreateCourseModulesComponent {
  moduleForm: FormGroup;
 
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService
  ) {
    this.moduleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    const saveData = this.apiService.getModuleData();
    if(saveData){
      this.moduleForm.patchValue(saveData);
    }
    console.log(saveData);
    
   }
 
   submitForm(){
      this.apiService.saveModuleData(this.moduleForm.value);
      this.router.navigate(['/instructor-layout/create-course-lesson']);
   }
 
   onPrevious() {
     this.router.navigate(['/instructor-layout/create-courses']);
   }
}
