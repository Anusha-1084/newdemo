import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client/dist/sockjs';
import { AuthService } from 'src/app/core/services/authservice/auth.service';
import { Client, Message } from 'stompjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // private stompClient: Client;

  constructor(private authService: AuthService) {  
    const socket = new SockJS('http://localhost:8888/ws'); 
    // this.stompClient = over(socket);
  }

  connect(onConnected: () => void): void {
    const token = this.authService.getAccessToken(); 
  /*  this.stompClient.connect(
      { Authorization:`Bearer ${token}`}, 
      () => {
        console.log('WebSocket connected');
        onConnected();  
      },
      (error) => {
        console.log('WebSocket connection failed. Retrying...');
        setTimeout(() => this.connect(onConnected), 2000); 
      }
    );*/
  }

  sendMessage(senderId: string, receiverId: string, content: string): void {
    const message = {
      // senderId,
      senderUsername: senderId,
      receiverId,
      content
    };
    // this.stompClient.send('/app/chat.send', {}, JSON.stringify(message));
  }

  subscribeToMessages(receiverId: string): Observable<any> {
    return new Observable(observer => {
    /*  this.stompClient.subscribe(`/user/${receiverId}/queue/messages`, (message) => {
      const received = JSON.parse(message.body);
      console.log('📥 Incoming message:', received);
      observer.next(received);
      });*/
    });
  }
}
