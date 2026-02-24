import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/services/authservice/auth.service';
import { FormsModule } from '@angular/forms';
import {
  Message,
  UserDetailsComponent,
} from '../user-details/user-details.component';

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  initials?: string;
  lastSeen?: string;
}

@Component({
  selector: 'app-directmessages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './directmessages.component.html',
  styleUrls: ['./directmessages.component.scss'],
})
export class DirectmessagesComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Output() userSelected = new EventEmitter<UserDto>();
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  users: UserDto[] = [];
  isLoading = false;
  isFetched = false;
  selectedUser: UserDto | null = null;
  loggedInUser: UserDto = { id: 0, firstName: '', lastName: '', email: '' };

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    console.log('DirectmessagesComponent initialized. Visible:', this.visible);
    if (!this.isFetched) {
      this.fetchUsers();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges called:', changes);

    if (changes['visible']?.currentValue === true && !this.isFetched) {
      console.log('Calling fetchUsers() from ngOnChanges');
      this.fetchUsers();
    }
  }

  selectUser(user: UserDto): void {
    this.selectedUser = user;
    this.userSelected.emit(user);
  }

  fetchUsers(): void {
    this.isLoading = true;
    const url = `${this.baseUrl}/api/v1/users`;
    const token = this.authService.getAccessToken();
    this.http.get<{ data: UserDto[] }>(url).subscribe({
      next: (res) => {
        this.users = res.data;
        this.isFetched = true;
        this.isLoading = false;

        const storedEmail = localStorage.getItem('loggedInEmail');
        const storedId = localStorage.getItem('loggedInId');
        const matchedUser = this.users.find(
          (user) =>
            user.email === storedEmail || user.id.toString() === storedId
        );

        if (matchedUser) {
          this.loggedInUser = {
            ...matchedUser,
            initials: this.getInitials(matchedUser),
            lastSeen: 'online',
          };
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
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