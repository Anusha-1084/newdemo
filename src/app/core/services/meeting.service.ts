import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MeetingDto } from 'src/app/models/MeetingDto.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private apiUrl = environment.baseUrl + '/meetings';

  constructor(private http: HttpClient) {}

  createMeeting(dto: MeetingDto): Observable<MeetingDto> {
    return this.http.post<MeetingDto>(this.apiUrl, dto);
  }

  joinMeeting(identifier: string, password?: string): Observable<MeetingDto> {
    let params = new HttpParams();
    if (password) params = params.set('password', password);
    return this.http.post<MeetingDto>(`${this.apiUrl}/${identifier}/join`, null, { params });
  }

  getUpcomingMeetings(): Observable<MeetingDto[]> {
    return this.http.get<MeetingDto[]>(`${this.apiUrl}/upcoming`);
  }

  getPastMeetings(): Observable<MeetingDto[]> {
    return this.http.get<MeetingDto[]>(`${this.apiUrl}/history`);
  }

  updateMeeting(id: number, dto: MeetingDto): Observable<MeetingDto> {
    return this.http.put<MeetingDto>(`${this.apiUrl}/${id}`, dto);
  }

  deleteMeeting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  lockMeeting(meetingId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${meetingId}/lock`, null);
  }

  kickUser(meetingId: string, userId: number): Observable<void> {
    const params = new HttpParams().set('userId', userId);
    return this.http.post<void>(`${this.apiUrl}/${meetingId}/kick`, null, { params });
  }

  getParticipants(meetingId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${meetingId}/participants`);
  }
}
