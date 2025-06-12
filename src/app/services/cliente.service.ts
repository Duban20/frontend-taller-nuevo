import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Cliente } from '../models/cliente.model';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:4000/clientes';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getClientes(): Observable<{cliente: Cliente[]}> {
    return this.http.get<{cliente: Cliente[]}>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createCliente(cliente: Cliente): Observable<{cliente: Cliente}> {
    return this.http.post<{cliente: Cliente}>(this.apiUrl, cliente, { headers: this.getAuthHeaders() });
  }

  updateCliente(id: number, cliente: Cliente): Observable<{cliente: Cliente}> {
    return this.http.put<{cliente: Cliente}>(`${this.apiUrl}/${id}`, cliente, { headers: this.getAuthHeaders() });
  }

  deleteCliente(id: number): Observable<{msg: string}> {
    return this.http.delete<{msg: string}>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
