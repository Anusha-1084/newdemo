import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';
import { ChatHistoryService } from '../chat-history.service';
import { UserDto } from '../directmessages/directmessages.component';

export interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isDateLabel?: boolean;
  displayDate?: string;
}

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnChanges {
  @ViewChild('chatContent') chatContentRef!: ElementRef;
  @ViewChild('messageArea') messageArea!: ElementRef;
  @ViewChild('messageInput') messageInputRef!: ElementRef;

  @ViewChild('chatWrapper') chatWrapper!: ElementRef;

  @Input() user: any; // Receiver
  @Input() loggedInUserId!: number; // Sender

  @Output() messageSent = new EventEmitter<Message>();

  messages: Message[] = [];
  newMessage: string = '';

  private connected = false;
  loadingMessages = false;
  autoScrollEnabled = true;

  constructor(
    private chatService: ChatService,
    private chatHistoryService: ChatHistoryService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Make sure the user is selected
    if (this.user && this.loggedInUserId) {
      this.loadMessages(); // Load chat messages between logged-in user and selected user
    }

    this.chatService.connect(() => {
      console.log('✅ WebSocket Connected!');

      this.chatService
        .subscribeToMessages(this.loggedInUserId.toString())
        .subscribe((message) => {
          console.log('📥 Incoming message:', message);
          this.messages.push(message); // ✅ should show in chat panel
          // this.scrollToBottom(); // Ensure scroll is at the bottom
          // setTimeout(() => this.scrollToBottom(), 100);
          const displayDate = this.getDisplayDate(message.timestamp);
          const lastDisplayDate = this.messages
            .filter((m) => m.isDateLabel)
            .slice(-1)[0]?.displayDate;
          if (lastDisplayDate !== displayDate) {
            this.messages.push({
              isDateLabel: true,
              content: '',
              senderId: '',
              receiverId: '',
              timestamp: '',
              displayDate,
            });
          }
          this.messages.push(message);
          this.cdRef.detectChanges();
          if (this.autoScrollEnabled) {
            setTimeout(() => this.scrollToBottom(), 100);
          }
        });
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.user.initials =
        (this.user.firstName?.[0] || '') + (this.user.lastName?.[0] || '');
      this.loadMessages();
    }
  }

  loadMessages(): void {
    this.chatHistoryService
      .getChatHistory(this.loggedInUserId.toString(), this.user.id.toString())
      .subscribe((messages) => {
        this.messages = [];
        let lastDate = '';
        messages.forEach((msg) => {
          const displayDate = this.getDisplayDate(msg.timestamp);
          if (lastDate !== displayDate) {
            this.messages.push({
              isDateLabel: true,
              content: '',
              senderId: '',
              receiverId: '',
              timestamp: '',
              displayDate,
            });
            lastDate = displayDate;
          }
          this.messages.push({
            ...msg,
            senderId: msg.senderId.toString(),
            receiverId: msg.receiverId.toString(),
            timestamp: msg.timestamp,
          });
        });
        setTimeout(() => this.scrollToBottom(), 100);
      });
  }

  sendMessage(): void {
    const trimmed = this.newMessage.trim();
    if (!trimmed || !this.user || !this.loggedInUserId) return;

    const message: Message = {
      senderId: this.loggedInUserId.toString(),
      receiverId: this.user.id.toString(),
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    const displayDate = this.getDisplayDate(message.timestamp);
    const lastDisplayDate = this.messages
      .filter((m) => m.isDateLabel)
      .slice(-1)[0]?.displayDate;
    if (lastDisplayDate !== displayDate) {
      this.messages.push({
        isDateLabel: true,
        content: '',
        senderId: '',
        receiverId: '',
        timestamp: '',
        displayDate,
      });
    }

    this.messages.push(message);
    this.newMessage = '';
    this.cdRef.detectChanges();
    setTimeout(() => this.scrollToBottom(), 100);
    this.chatService.sendMessage(message.senderId, message.receiverId, trimmed);
  }

  scrollToBottom(): void {
    try {
      const el = this.chatContentRef?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch (err) {
      console.warn('❌ Scroll error:', err);
    }
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }

  getDisplayDate(isoDate: string): string {
    const date = new Date(isoDate);
    const now = new Date();

    const isSameDay = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isSameDay) return 'Today';
    if (isYesterday) return 'Yesterday';

    const diff = now.getTime() - date.getTime();
    const daysDiff = diff / (1000 * 60 * 60 * 24);
    if (daysDiff < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const isAtBottom =
      target.scrollHeight - target.scrollTop === target.clientHeight;
    this.autoScrollEnabled = isAtBottom;
  }

  getInitials(user: UserDto): string {
    return (
      (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '')
    ).toUpperCase();
  }

  getAvatarColor(user: UserDto): string {
    const colors = [
      '#5A67D8',
      '#48BB78',
      '#ED8936',
      '#E53E3E',
      '#319795',
      '#805AD5',
    ];
    const hash = (user.firstName + user.lastName)
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
}