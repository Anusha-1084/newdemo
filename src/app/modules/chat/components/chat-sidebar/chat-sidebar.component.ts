import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/authservice/auth.service';
import { DirectmessagesComponent } from '../directmessages/directmessages.component';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from '../user-details/user-details.component';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [CommonModule, DirectmessagesComponent, UserDetailsComponent],
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss'],
})
export class ChatSidebarComponent {
  showDirectMessages = false;
  selectedUser: any = null;

  loggedInUser: any = null;

  ngOnInit(): void {
    this.initializeLoggedInUser();
  }

  initializeLoggedInUser() {
    const id = localStorage.getItem('loggedInId');
    const username = localStorage.getItem('loggedInUsername');

    if (id && username) {
      this.loggedInUser = {
        id: Number(id),
        username: username,
      };
      console.log('✅ loggedInUser:', this.loggedInUser);
    } else {
      console.error(
        '❌ Missing loggedInId or loggedInUsername in localStorage'
      );
    }
  }

  onUserSelected(user: any) {
    this.selectedUser = user;
    if (!this.loggedInUser) {
      this.initializeLoggedInUser();
    }
    console.log('✅ selectedUser:', this.selectedUser);
    console.log('✅ loggedInUser:', this.loggedInUser);
  }

  toggleDirectMessages(event: MouseEvent) {
    event.stopPropagation();
    this.showDirectMessages = !this.showDirectMessages;
    console.log('Toggled showDirectMessages:', this.showDirectMessages);
  }
}