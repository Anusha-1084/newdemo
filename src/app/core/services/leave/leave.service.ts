import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private http = inject(HttpClient);
  private baseUrl = (environment.baseUrl ?? 'http://localhost:8888') + '/api/leaves';

  private authHeaders(token?: string | null) {
    return token ? { headers: { Authorization: `Bearer ${token}` } as any } : {};
  }
  // POST /api/leaves
  // --------------------------------------------
  applyLeave(payload: any, token?: string | null): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.post<any>(url, payload, this.authHeaders(token));
  }
  // GET MY LEAVES
  // GET /api/leaves/my-leaves
  // --------------------------------------------
  getMyLeaves(token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/my-leaves`;
    return this.http.get<any>(url, this.authHeaders(token));
  }
  // GET ALL LEAVES (Admin/Manager)
  // GET /api/leaves
  // --------------------------------------------
  getAllLeaves(token?: string | null): Observable<any> {
    return this.http.get<any>(this.baseUrl, this.authHeaders(token));
  }
  // GET LEAVE BY ID
  // GET /api/leaves/{id}
  // --------------------------------------------
  getLeaveById(id: number | string, token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<any>(url, this.authHeaders(token));
  }
  // UPDATE MY LEAVE
  // PUT /api/leaves/{id}
  // --------------------------------------------
  updateLeave(id: number | string, payload: any, token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<any>(url, payload, this.authHeaders(token));
  }
  // DELETE LEAVE
  // DELETE /api/leaves/{id}
  // --------------------------------------------
  deleteLeave(id: number | string, token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<any>(url, this.authHeaders(token));
  }
  // CANCEL LEAVE
  // PUT /api/leaves/{id}/cancel
  // --------------------------------------------
  cancelLeave(id: number | string, token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/${id}/cancel`;
    return this.http.put<any>(url, {}, this.authHeaders(token));
  }
  // UPCOMING LEAVES
  // GET /api/leaves/my-upcoming/{employeeId}
  // --------------------------------------------
  getUpcomingLeaves(employeeId: number, token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/my-upcoming/${employeeId}`;
    return this.http.get<any>(url, this.authHeaders(token));
  }
  // TEAM LEAVES (Admin/Mgr)
  // GET /api/leaves/team?status=
  // --------------------------------------------
  getTeamLeaves(status?: string, token?: string | null): Observable<any> {
    const qs = status ? `?status=${status}` : '';
    const url = `${this.baseUrl}/team${qs}`;
    return this.http.get<any>(url, this.authHeaders(token));
  }
  // APPROVE LEAVE
  // POST /api/leaves/approve/{leaveId}
  // --------------------------------------------
  approveLeave(id: number, comment: string, token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/approve/${id}`;
    return this.http.post<any>(url, { comment }, this.authHeaders(token));
  }
  // REJECT LEAVE
  // POST /api/leaves/reject/{leaveId}
  // --------------------------------------------
  rejectLeave(id: number, comment: string, token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/reject/${id}`;
    return this.http.post<any>(url, { comment }, this.authHeaders(token));
  }
  // VALIDATE LEAVE
  // POST /api/leaves/validate
  // --------------------------------------------
  validateLeave(payload: any, token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/validate`;
    return this.http.post<any>(url, payload, this.authHeaders(token));
  }
  // EMPLOYEE CALENDAR
  // GET /api/leaves/calendar/employee/{employeeId}
  // --------------------------------------------
  getEmployeeCalendar(employeeId: number, token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/calendar/employee/${employeeId}`;
    return this.http.get<any>(url, this.authHeaders(token));
  }
  // MONTHLY CALENDAR
  // GET /api/leaves/calendar/month?year=&month=
  // --------------------------------------------
  getMonthlyCalendar(year: number, month: number, token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/calendar/month`;
    const opts: any = {
      params: { year, month },
      ...this.authHeaders(token)
    };
    return this.http.get<any>(url, opts);
  }
  // TEAM CALENDAR
  // GET /api/leaves/team-calendar
  // --------------------------------------------
  getTeamCalendar(token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/team-calendar`;
    return this.http.get<any>(url, this.authHeaders(token));
  }
  
//
//   getPendingTeamApprovals(): Observable<any[]> {
//    return this.http.get<any[]>(`${this.baseUrl}/api/leaves/team?status=PENDING`);
//  }

}