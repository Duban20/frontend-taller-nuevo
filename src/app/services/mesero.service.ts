import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mesero } from '../models/mesero.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MeseroService {
  private apiUrl = 'http://localhost:4000/meseros';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getMeseros(): Observable<Mesero[]> {
    return this.http.get<Mesero[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getMesero(id: number): Observable<Mesero> {
    return this.http.get<Mesero>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createMesero(mesero: Mesero): Observable<Mesero> {
    return this.http.post<Mesero>(this.apiUrl, mesero, { headers: this.getAuthHeaders() });
  }

  updateMesero(id: number, mesero: Mesero): Observable<Mesero> {
    return this.http.put<Mesero>(`${this.apiUrl}/${id}`, mesero, { headers: this.getAuthHeaders() });
  }

  deleteMesero(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
