import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Menu } from '../models/menu.model';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private apiUrl = 'http://localhost:4000/menus';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getMenuById(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createMenu(menu: Omit<Menu, 'id'>): Observable<Menu> {
    return this.http.post<Menu>(this.apiUrl, menu, { headers: this.getAuthHeaders() });
  }

  updateMenu(id: number, menu: Omit<Menu, 'id'>): Observable<Menu> {
    return this.http.put<Menu>(`${this.apiUrl}/${id}`, menu, { headers: this.getAuthHeaders() });
  }

  deleteMenu(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
