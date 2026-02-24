import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenService } from '../tokenservice/token.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) { }

  private courseData: any = {};
  private moduleData: any = {};
  private lessonData: any = {};

  saveCourseData(data: any){
    this.courseData = data;
  }

  getCourseData(){
    return this.courseData
  }

  saveModuleData(data: any){
    this.moduleData = data;
  }

  getModuleData(){
    return this.moduleData;
  }

  saveLessonData(data: any) {
    this.lessonData = data;
  }

  getLessonData() {
    return this.lessonData;
  }


  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getAccessToken();
    console.log(token);
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createCourse(course: any): Observable<any> {
    return this.http.post(`${environment.courseUrl}`, course, { headers: this.getHeaders() });
  }

  createCourseModule(courseModule: any): Observable<any> {
    return this.http.post(`${environment.courseModuleUrl}`, courseModule, { headers: this.getHeaders() });
  }

  createLesson(lesson: any): Observable<any>  {
    return this.http.post(`${environment.lessonUrl}`, lesson, { headers: this.getHeaders() });
  }
  
}
