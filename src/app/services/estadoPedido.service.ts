import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EstadoPedido } from '../models/estado-pedido.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstadoPedidoService {
  getEstadosDefinidos() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:4000/estado-pedidos';

  constructor(private http: HttpClient) {}

  getEstados(): Observable<EstadoPedido[]> {
    return this.http.get<EstadoPedido[]>(this.apiUrl);
  }

  getEstadosByPedido(pedidoId: number): Observable<EstadoPedido[]> {
    return this.http.get<EstadoPedido[]>(
      `${this.apiUrl}/pedido/${pedidoId}`
    );
  }

  createEstado(estado: Omit<EstadoPedido, 'id'>): Observable<EstadoPedido> {
    return this.http.post<EstadoPedido>(this.apiUrl, estado);
  }

  updateEstado(id: number, estado: Omit<EstadoPedido, 'id'>): Observable<EstadoPedido> {
    return this.http.put<EstadoPedido>(`${this.apiUrl}/${id}`, estado);
  }

  deleteEstado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
