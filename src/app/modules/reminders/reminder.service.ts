import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reminder } from 'src/app/models/reminder.model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private apiUrl = environment.baseUrl + '/reminders';
  private attachmentUrl = environment.baseUrl + '/api/attachments';

  constructor(private http: HttpClient) { }

  getReminders(): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(this.apiUrl);
  }

  createReminder(reminder: Reminder): Observable<Reminder> {
    return this.http.post<Reminder>(this.apiUrl, reminder);
  }

  updateReminder(id: number, reminder: Reminder): Observable<Reminder> {
    return this.http.put<Reminder>(`${this.apiUrl}/${id}`, reminder);
  }

  deleteReminder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  uploadAttachment(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.attachmentUrl, formData, { responseType: 'text' });
  }
}
