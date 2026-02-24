import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  private http = inject(HttpClient);
  private baseUrl = (environment.baseUrl ?? 'http://localhost:8888') + '/api/holidays';

  private authHeaders(token?: string | null) {
    return token ? { headers: { Authorization: `Bearer ${token}` } as any } : {};
  }

  /** GET /api/holidays */
  getAllHolidays(token?: string | null): Observable<any> {
    return this.http.get<any>(this.baseUrl, this.authHeaders(token));
  }

  /** POST /api/holidays/bulk */
  addBulkHolidays(payload: any[], token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/bulk`;
    return this.http.post<any>(url, payload, this.authHeaders(token));
  }
}
