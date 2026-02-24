import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client, IMessage } from '@stomp/stompjs';
import { UserDataService } from 'src/app/core/services/user-data.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() roomId!: string;
  @Input() username: string = 'Guest';
  @Input() messages: { sender: string; content: string; timestamp?: Date }[] = [];
  @Output() messageSent = new EventEmitter<string>();

  @ViewChild('chatMessagesContainer') private chatContainer!: ElementRef;

  private stompClient!: Client;
  newMessage: string = '';

  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {
    const userData = this.userDataService.getCurrentUserData();
    if (userData?.username) {
      this.username = userData.username;
    }

    const storedMessages = localStorage.getItem(`chat_${this.roomId}`);
    if (storedMessages) {
      this.messages = JSON.parse(storedMessages);
    }

    this.stompClient = new Client({
      brokerURL: `ws://localhost:8888/ws`,
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP DEBUG]:', str),
      onConnect: () => {
        console.log('✅ STOMP connected for chat');

        // Subscribe to meeting chat topic
        this.stompClient.subscribe(`/topic/meeting/${this.roomId}/chat`, (message: IMessage) => {
          try {
            const body = JSON.parse(message.body);
            if (body && body.sender && body.message) {
              const msg = {
                sender: body.sender,
                content: body.message,
                timestamp: new Date(body.timestamp || Date.now())
              };
              this.messages.push(msg);

              localStorage.setItem(`chat_${this.roomId}`, JSON.stringify(this.messages));
              this.scrollToBottom();
            } else {
              console.warn('Malformed chat message received:', body);
            }
          } catch (err) {
            console.error('Failed to parse message body', err);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      }
    });

    this.stompClient.activate();
  }

  ngAfterViewInit(): void {
    // Initial scroll if messages already loaded
    setTimeout(() => this.scrollToBottom(), 100);
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const msg = {
      sender: this.username,
      message: this.newMessage,
      timestamp: new Date().toISOString()
    };

    this.stompClient.publish({
      destination: `/app/meeting/${this.roomId}/chat`,
      body: JSON.stringify(msg)
    });

    this.newMessage = '';
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.chatContainer) {
      try {
        setTimeout(() => {
          this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
        }, 100);
      } catch (err) {
        console.warn('Scroll failed:', err);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
    }

    localStorage.setItem(`chat_${this.roomId}`, JSON.stringify(this.messages));
  }
}
