import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/services/authservice/auth.service';
import { environment } from 'src/environments/environment';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdTimestamp: any;
  assignedUserId: string;
}

interface PaginatedTickets {
  content: Ticket[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Component({
  selector: 'app-myticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './myticket.component.html',
  styleUrls: ['./myticket.component.scss']
})
export class MyticketComponent implements OnInit {
  private baseUrl = environment.baseUrl;
  apiUrl = `${this.baseUrl}/tickets/getAllTickets`;

  tickets: Ticket[] = [];

  currentPage = 0;
  pageSize = 5;
  totalPages = 0;

  searchText: string = '';
  searchTimeout: any;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const userId = this.authService.getId();
    if (userId) {
      this.fetchTickets(Number(userId));
    } else {
      console.warn('No user ID found. User may not be authenticated.');
    }
  }

  fetchTickets(userId: number, query?: string, page: number = 0, size: number = 5) {
    const token = this.authService.getAccessToken();
    if (!token) {
      console.error('❌ Token not available. User not authenticated.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    let params: any = { userId, page, size };
    if (query) params.query = query;

    this.http.get<PaginatedTickets>(this.apiUrl, { params, headers })
      .pipe(catchError(this.handleError))
      .subscribe({
        next: (data) => {
          this.tickets = data.content;
          this.totalPages = data.totalPages;
          this.currentPage = data.number;
          console.log('✅ Paginated tickets:', data);
        },
        error: (error) => console.error('❌ Error fetching tickets:', error)
      });
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      const userId = this.authService.getId();
      if (userId) {
        this.fetchTickets(Number(userId), this.searchText.trim(), page, this.pageSize);
      }
    }
  }

  updateTicket(ticket: Ticket) {
    console.log('✏️ Navigating to update ticket:', ticket);
    this.router.navigate(['/layout/ticket/update-ticket', ticket.id]);
  }

  deleteTicket(ticketId: number) {
    const confirmed = confirm('Are you sure you want to delete this ticket?');
    if (!confirmed) return;

    const token = this.authService.getAccessToken();
    if (!token) {
      console.error('❌ Token not available. User not authenticated.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const deleteUrl = `${this.baseUrl}/tickets/${ticketId}`;

    this.http.delete(deleteUrl, { headers })
      .pipe(catchError(this.handleError))
      .subscribe({
        next: () => {
          console.log('🗑️ Ticket deleted successfully');
          this.tickets = this.tickets.filter(ticket => ticket.id !== ticketId);
        },
        error: (err) => console.error('❌ Error deleting ticket:', err)
      });
  }

  onSearchInputChange() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      const userId = this.authService.getId();
      if (userId) {
        this.fetchTickets(Number(userId), this.searchText.trim(), 0, this.pageSize);
      }
    }, 300); // Debounce by 300ms
  }

  private handleError(error: HttpErrorResponse) {
    console.error('❌ API Error:', error);
    return throwError(() => new Error('Failed to fetch tickets. Please try again later.'));
  }
}

