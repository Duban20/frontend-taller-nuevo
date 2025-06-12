import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Mesa } from '../models/mesa.model';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class MesaService {
  private apiUrl = 'http://localhost:4000/mesas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getMesaById(id: number): Observable<Mesa> {
    return this.http.get<Mesa>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createMesa(mesa: Omit<Mesa, 'id'>): Observable<Mesa> {
    return this.http.post<Mesa>(this.apiUrl, mesa, { headers: this.getAuthHeaders() });
  }

  updateMesa(id: number, mesa: Omit<Mesa, 'id'>): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.apiUrl}/${id}`, mesa, { headers: this.getAuthHeaders() });
  }

  deleteMesa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
