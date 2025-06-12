import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string, refreshToken?: string, user: any }> {
    return this.http.post<{ token: string, refreshToken?: string, user: any }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}