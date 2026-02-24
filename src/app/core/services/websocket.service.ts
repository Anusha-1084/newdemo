import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private connected = false;
  private messageSubject = new Subject<any>();
  private chatSubject = new Subject<any>();
  private participantSubject = new Subject<any>();
  private signalSubject = new Subject<any>();
  private currentMeetingId: string = '';

  connect(meetingId: string): void {
    if (this.connected && this.currentMeetingId === meetingId) return;

    this.disconnect();
    this.currentMeetingId = meetingId;

    const wsUrl = environment.baseUrl.replace('http', 'ws') + '/ws';
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      this.connected = true;
      console.log('🟢 WebSocket connected to meeting:', meetingId);
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      this.connected = false;
      console.log('🔴 WebSocket disconnected');
    };
  }

  private handleMessage(message: any): void {
    if (message.destination) {
      if (message.destination.includes('/chat')) {
        this.chatSubject.next(message.body);
      } else if (message.destination.includes('/participants')) {
        this.participantSubject.next(message.body);
      } else if (message.destination.includes('/signal')) {
        this.signalSubject.next(message.body);
      }
    }
    this.messageSubject.next(message);
  }

  sendChatMessage(meetingId: string, message: any): void {
    this.sendMessage(`/app/meeting/${meetingId}/chat`, message);
  }

  sendParticipantAction(meetingId: string, action: any): void {
    this.sendMessage(`/app/meeting/${meetingId}/participant-action`, action);
  }

  sendWebRTCSignal(meetingId: string, signal: any): void {
    this.sendMessage(`/app/meeting/${meetingId}/webrtc-signal`, signal);
  }

  private sendMessage(destination: string, body: any): void {
    if (this.socket && this.connected) {
      const message = {
        command: 'SEND',
        destination: destination,
        body: JSON.stringify(body)
      };
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected');
    }
  }

  onChatMessage(): Observable<any> {
    return this.chatSubject.asObservable();
  }

  onParticipantUpdate(): Observable<any> {
    return this.participantSubject.asObservable();
  }

  onSignal(): Observable<any> {
    return this.signalSubject.asObservable();
  }

  onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connected = false;
      this.currentMeetingId = '';
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}
