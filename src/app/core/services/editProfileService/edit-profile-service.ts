import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class EditProfileService {
   
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    const url = `${this.baseUrl}/api/v1/users/profile`;
    return this.http.get(url);
  }

  updateUserProfile(user: any): Observable<any> {
    const url = `${this.baseUrl}/api/v1/users/update-profile`;
    return this.http.post(url, user);
  }
}
