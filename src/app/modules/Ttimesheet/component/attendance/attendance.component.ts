import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/authservice/auth.service';
import { RouterModule,Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule,HttpClientModule,RouterModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})

  
export class AttendanceComponent implements OnInit{
 weeklyData: any[] = [];
  // shiftTime = '10:30 - 7:30';
  showPopup = false;
  private baseUrl = environment.baseUrl;


  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

 ngOnInit(): void {
  const token = this.authService.getAccessToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  

  const url = `${this.baseUrl}/checkout/weekly`;
  this.http.get<any[]>(url, { headers }).subscribe({
    next: (data) => {
      console.log('Weekly Data:', data);
      this.weeklyData = data.map(item => ({
  ...item,
  day: item.date ? new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }) : '',
  totalHours: item.total_hours_time || '0:00.00'
}));

    },
    error: (error) => {
      console.error('API error:', error);
    }
  });
}
  calculateHours(startTime: string, endTime: string): string {
    if (!startTime || !endTime) return '';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

 onConfirmAll(): void {
  console.log('Confirming all records');
  // Add logic if needed
   this.showPopup = true;
}

  closePopup() {
    this.showPopup = false;
  }

//  redirectToCreateTicket() {
//     this.router.navigate(['/layout/ticket'],  {
//       state: { message: 'Submit your timesheet ticket' }
//   });
    
//   }
redirectToCreateTicket() {
  this.router.navigate(['/layout/ticket'], {
   queryParams: { 
      heading: 'Timesheet Attendance Issue' 
    }
  });
}


}

