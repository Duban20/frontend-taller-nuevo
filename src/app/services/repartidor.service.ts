import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Repartidor } from '../models/repartidor.model';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RepartidorService {
  private apiUrl = 'http://localhost:4000/repartidores';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getRepartidores(): Observable<Repartidor[]> {
    return this.http.get<Repartidor[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getRepartidorById(id: number): Observable<Repartidor> {
    return this.http.get<Repartidor>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createRepartidor(repartidor: Omit<Repartidor, 'id'>): Observable<Repartidor> {
    return this.http.post<Repartidor>(this.apiUrl, repartidor, { headers: this.getAuthHeaders() });
  }

  updateRepartidor(id: number, repartidor: Omit<Repartidor, 'id'>): Observable<Repartidor> {
    return this.http.put<Repartidor>(`${this.apiUrl}/${id}`, repartidor, { headers: this.getAuthHeaders() });
  }

  deleteRepartidor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
