import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TimesheetRequest } from 'src/app/models/timesheet-request.model';
import { ApiResponse } from 'src/app/models/api-response.model'; // ✅ import added
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {
  private http = inject(HttpClient);
  private baseUrl = (environment.baseUrl ?? 'http://localhost:8888') + '/timesheet';

  private authHeaders(token?: string | null) {
    return token ? { headers: { Authorization: `Bearer ${token}` } as any } : {};
  }

  /** POST /timesheet/log */
  submitTimesheet(payload: TimesheetRequest, token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/log`;
    return this.http.post<any>(url, payload, this.authHeaders(token));
  }

  /** GET /timesheet?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD */
  getTimesheetEntries(startDate: string, endDate: string, token?: string | null): Observable<any> {
    const url = `${this.baseUrl}`;
    const opts: any = { params: { startDate, endDate }, ...this.authHeaders(token) };
    return this.http.get<any>(url, opts);
  }

  /** GET /timesheet/history/all */
  getAllTimesheets(token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/history/all`;
    return this.http.get<any>(url, this.authHeaders(token));
  }

  /** GET /timesheet/history */
  getMyHistory(token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/history`;
    return this.http.get<any>(url, this.authHeaders(token));
  }

  /** POST /timesheet/{id}/approve */
  approveTimesheet(id: number | string, token?: string | null): Observable<ApiResponse<void>> {
    const url = `${this.baseUrl}/${id}/approve`;
    return this.http.post<ApiResponse<void>>(url, {}, this.authHeaders(token));
  }

  /** POST /timesheet/{id}/reject?reason= */
  rejectTimesheet(id: number | string, reason = '', token?: string | null): Observable<ApiResponse<void>> {
    const qs = reason ? `?reason=${encodeURIComponent(reason)}` : '';
    const url = `${this.baseUrl}/${id}/reject${qs}`;
    return this.http.post<ApiResponse<void>>(url, {}, this.authHeaders(token));
  }
}
