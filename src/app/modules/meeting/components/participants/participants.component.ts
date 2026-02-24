import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MeetingService } from 'src/app/core/services/meeting.service';
import { Client, IMessage } from '@stomp/stompjs';
import { Subscription } from 'rxjs';

export interface Participant {
  userId: number;
  username: string;
  role: string;
  status: string;
  audioMuted?: boolean;
  videoOff?: boolean;
  handRaised?: boolean;
  inWaitingRoom?: boolean;
}

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit, OnDestroy {
  @Input() data!: { meetingId: string };

  meetingId: string = '';
  participants: Participant[] = [];
  private stompClient!: Client;
  private subscription?: Subscription;

  constructor(private meetingService: MeetingService) {}

  ngOnInit(): void {
    this.meetingId = this.data?.meetingId || '';
    this.loadParticipants();
    this.setupWebSocketConnection();
  }

  private loadParticipants(): void {
    this.meetingService.getParticipants(this.meetingId).subscribe({
      next: (participants) => {
        this.participants = participants;
      },
      error: (err) => console.error('Error loading participants:', err)
    });
  }

  private setupWebSocketConnection(): void {
    this.stompClient = new Client({
      brokerURL: `ws://localhost:8888/ws`,
      reconnectDelay: 5000,
      debug: (str) => console.log('[PARTICIPANTS STOMP]:', str),
      onConnect: () => {
        console.log('✅ STOMP connected for participants');
        this.stompClient.subscribe(`/topic/meeting/${this.meetingId}/participants`, (message: IMessage) => {
          try {
            const update = JSON.parse(message.body);
            this.handleParticipantUpdate(update);
          } catch (err) {
            console.error('Failed to parse participant update', err);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      }
    });

    this.stompClient.activate();
  }

  private handleParticipantUpdate(update: any): void {
    const userId = update.userId;
    const index = this.participants.findIndex(p => p.userId === userId);

    if (index !== -1) {
      this.participants[index] = {
        ...this.participants[index],
        audioMuted: update.action === 'MUTE_AUDIO' ? true :
                    update.action === 'UNMUTE_AUDIO' ? false :
                    this.participants[index].audioMuted,

        videoOff: update.action === 'TURN_OFF_VIDEO' ? true :
                  update.action === 'TURN_ON_VIDEO' ? false :
                  this.participants[index].videoOff,

        handRaised: update.action === 'RAISE_HAND' ? true :
                    update.action === 'LOWER_HAND' ? false :
                    this.participants[index].handRaised
      };
    } else {
      this.participants.push({
        userId: update.userId,
        username: update.username,
        role: update.role || 'USER',
        status: 'ACTIVE',
        audioMuted: false,
        videoOff: false,
        handRaised: update.action === 'RAISE_HAND'
      });
    }
  }

  close(): void {
    this.participants = [];
  }

  
  ngOnDestroy(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
