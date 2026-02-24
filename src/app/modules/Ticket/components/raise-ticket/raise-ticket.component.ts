import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';  // ✅ Required for standalone components
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient,HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/authservice/auth.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-raise-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],  // ✅ Ensure CommonModule is imported
  templateUrl: './raise-ticket.component.html',
  styleUrls: ['./raise-ticket.component.scss']  // ✅ Fixed styleUrls
})
export class RaiseTicketComponent {

  private baseUrl = environment.baseUrl;

  ticketForm: FormGroup;
  priorities = ['HIGH', 'MEDIUM', 'LOW'];
  private apiUrl = `${this.baseUrl}/tickets/createTicket`; // Backend URL

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService) {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      priority: ['', Validators.required],
      createdBy: ['', Validators.required], // Auto-filled user ID
      assignedUserId: ['', Validators.required] // User inputs assigned user ID
    });
  }

  ngOnInit() {
    const userId = this.authService.getId();
    if (userId) {
      this.ticketForm.patchValue({ createdBy: Number(userId) }); // ✅ Ensure it's a number
      console.log("Created By set:", this.ticketForm.value.createdBy);
    } else {
      console.warn("No user ID found. User may not be authenticated.");
    }
  }

  isFieldInvalid(field: string): boolean {
    return this.ticketForm.controls[field].invalid && this.ticketForm.controls[field].touched;
  }

  createTicket(ticketData: any): Observable<any> {
    console.log("🚀 Sending API Request with data:", ticketData);

    const token = this.authService.getAccessToken();
    if (!token) {
      console.error('❌ Token not available. User not authenticated.');
      return throwError(() => new Error('User not authenticated'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log(headers);
    console.log(ticketData);


    return this.http.post<any>(this.apiUrl, ticketData, { headers }).pipe(
      catchError((error) => {
        console.error("❌ API call failed:", error);
        catchError((error: HttpErrorResponse) => {
          console.error("❌ API call failed:", error);
          console.error("❌ Status:", error.status);
          console.error("❌ Error Message:", error.message);
          console.error("❌ Response Body:", error.error);
          return throwError(() => new Error(error.message));
        })
        return throwError(() => new Error("API error"));
      })
    );
  }

  onSubmit() {
    if (!this.ticketForm.value.createdBy) {
      console.log(this.ticketForm);
      alert("❌ Created By is missing. Please log in again.");
      return;
    }

    if (this.ticketForm.valid) {
      // ✅ Convert assignedUserId to a number before sending the request
      const ticketData = {
        ...this.ticketForm.value,
        createdBy: Number(this.ticketForm.value.createdBy), 
        assignedUserId: Number(this.ticketForm.value.assignedUserId) // ✅ Fix: Ensure it's a number
      };

      console.log("🚀 Sending API Request:", ticketData);

      this.createTicket(ticketData).subscribe({
        next: (response) => {
          console.log('✅ Ticket Created:', response);
          alert('🎉 Ticket submitted successfully!');
          this.ticketForm.reset();
        },
        error: (err) => {
          console.error('❌ Error creating ticket:', err);
          alert('⚠️ Failed to submit ticket.');
        }
      });
    } else {
      console.log('❌ Form is invalid');
    }
  }
}
