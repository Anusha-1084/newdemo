import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup,  ReactiveFormsModule,  Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/authservice/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-ticket',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-ticket.component.html',
  styleUrl: './update-ticket.component.scss'
})
export class UpdateTicketComponent implements OnInit {


  ticketForm!: FormGroup;
  ticketId!: number;
  private baseUrl = environment.baseUrl;

  

  ngOnInit(): void {
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
  
    this.ticketForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      assignedUserId: ['', Validators.required],
    });
  
    this.loadTicketData();
  }



constructor(
  private route: ActivatedRoute,
  private fb: FormBuilder,
  private http: HttpClient,
  private authService: AuthService,
  private router: Router
) {}


loadTicketData() {
  const token = this.authService.getAccessToken();
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  this.http.get<any>(`${this.baseUrl}/tickets/${this.ticketId}`, { headers })
    .pipe(catchError(err => throwError(() => new Error('Failed to load ticket'))))
    .subscribe(ticket => {
      this.ticketForm.patchValue({
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        assignedUserId: ticket.assignedUserId,
      });
    });
}

onSubmit() {
  if (this.ticketForm.invalid) return;

  const token = this.authService.getAccessToken();
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  this.http.put(`${this.baseUrl}/tickets/${this.ticketId}`, this.ticketForm.value, { headers })
    .subscribe({
      next: () => {
        alert('✅ Ticket updated successfully');
        this.router.navigate(['/layout/ticket/myticket']);
      },
      error: () => alert('❌ Failed to update ticket'),
    });
}

}
