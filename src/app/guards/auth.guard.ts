import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, CanActivateChild, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.isTokenValid()) {
      return true;
    } else {
      this.authService.logout();
      return this.router.createUrlTree(['/login']);
    }
  }

  canLoad(): boolean | UrlTree {
    return this.canActivate();
  }

  canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }

  private isTokenValid(): boolean {
    const token = this.authService.getToken();
    if (!token) return false;

    // Decodifica el JWT (parte payload es base64)
    const payload = token.split('.')[1];
    if (!payload) return false;
    try {
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