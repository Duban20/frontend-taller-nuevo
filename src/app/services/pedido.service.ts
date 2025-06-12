import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';
import { AuthService } from '../auth/auth.service';

interface PedidosResponse {
  pedidos: Pedido[];
}

interface PedidoResponse {
  message: string;
  pedido: Pedido;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:4000/pedidos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getPedidos(): Observable<PedidosResponse> {
    return this.http.get<PedidosResponse>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getPedido(id: number): Observable<{ pedido: Pedido }> {
    return this.http.get<{ pedido: Pedido }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createPedido(pedido: any): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(this.apiUrl, pedido, { headers: this.getAuthHeaders() });
  }

  updatePedido(id: number, pedido: any): Observable<PedidoResponse> {
    return this.http.put<PedidoResponse>(`${this.apiUrl}/${id}`, pedido, { headers: this.getAuthHeaders() });
  }

  deletePedido(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getEstadosDefinidos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/estados-definidos`, { headers: this.getAuthHeaders() });
  }

  updateEstadoActual(id: number, estado_actual: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${id}/estado`,
      { estado_actual },
      { headers: this.getAuthHeaders() }
    );
  }
}
