import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {
  private http = inject(HttpClient);
  private baseUrl = (environment.baseUrl ?? 'http://localhost:8888') + '/api/leave-types';

  private authHeaders(token?: string | null) {
    return token ? { headers: { Authorization: `Bearer ${token}` } as any } : {};
  }

  /** GET /api/leave-types */
  getAll(token?: string | null): Observable<any> {
    return this.http.get<any>(this.baseUrl, this.authHeaders(token));
  }

  /** POST /api/leave-types */
  create(payload: any, token?: string | null): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload, this.authHeaders(token));
  }

  /** PUT /api/leave-types/{id} */
  update(id: number, payload: any, token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<any>(url, payload, this.authHeaders(token));
  }

  /** DELETE /api/leave-types/{id} */
  delete(id: number, token?: string | null): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<any>(url, this.authHeaders(token));
  }
}
