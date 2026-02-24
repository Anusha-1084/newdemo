import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private apiUrl=environment.courseUrl;
  ;

  selectedCourse:any=null;

  constructor(private http:HttpClient) { }

  getCourses():Observable<any>{
    return this.http.get<any>(this.apiUrl);
  }
  
  getCourses1():Observable<any>{
    return this.selectedCourse;
  }
  setCourse(course:any):Observable<any>{
    return this.selectedCourse=course;
  }
}
