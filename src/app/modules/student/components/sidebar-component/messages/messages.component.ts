import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  RouterModule } from '@angular/router';



@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent {
  unreadMessages: number = 0;
  messages: {
    id: number;
    sender: string;
    subject: string;
    content: string;
    read: boolean;
  }[] = [];
  selectedMessage: any = null;
  filter: string = 'Unread';
  searchText: string = '';

  constructor() {
   
    this.messages = [
      {
        id: 1,
        sender: 'John Doe',
        subject: 'Meeting Reminder',
        content: 'Don’t forget our meeting at 3 PM.',
        read: false,
      },
      {
        id: 2,
        sender: 'Jane Smith',
        subject: 'Project Update',
        content: 'The project deadline has been extended.',
        read: true,
      },
    ];
    this.updateUnreadCount();
  }

  updateUnreadCount() {
    this.unreadMessages = this.messages.filter((msg) => !msg.read).length;
  }

  composeMessage() {
    alert('Compose Message Clicked!');
  }

  searchMessages() {
    console.log('Searching messages for:', this.searchText);
  }

  filterMessages() {
    return this.messages.filter(
      (msg) =>
        (this.filter === 'All' ||
          (this.filter === 'Unread' && !msg.read) ||
          (this.filter === 'Read' && msg.read)) &&
        (msg.sender.toLowerCase().includes(this.searchText.toLowerCase()) ||
          msg.subject.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }

  selectMessage(message: any) {
    this.selectedMessage = message;
    message.read = true;
    this.updateUnreadCount();
  }
}
