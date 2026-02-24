import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



export interface Message {
  id?: number;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  private apiUrl = `${environment.baseUrl}/api/chat/history`;

  constructor(private http: HttpClient) {}

  getChatHistory(user1: string, user2: string): Observable<Message[]> {
    const params = new HttpParams()
      .set('user1', user1)
      .set('user2', user2);

    return this.http.get<Message[]>(this.apiUrl, { params });
  }
}