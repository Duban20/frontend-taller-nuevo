import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    // Si el usuario YA tiene sesión activa, lo manda a /layout
    if (this.isTokenValid()) {
      return this.router.createUrlTree(['/layout']);
    }
    return true;
  }

  private isTokenValid(): boolean {
    const token = this.authService.getToken();
    if (!token) return false;
    try {
      const payload = token.split('.')[1];
      if (!payload) return false;
      const decoded = JSON.parse(atob(payload));
      if (!decoded.exp) return false;
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) return false; // Token expirado
      return true;
    } catch {
      return false;
    }
  }
}