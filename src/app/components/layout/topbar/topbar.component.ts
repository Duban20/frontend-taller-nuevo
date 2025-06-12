import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../../../services/layout.service';
import { ConfiguratorComponent } from '../configurator/configurator.component';
// import { AuthService } from '../../../services/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-topbar',
  imports: [RouterModule, CommonModule, StyleClassModule, ButtonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  items!: MenuItem[];

  constructor(
    public layoutService: LayoutService,
    // private authService: AuthService,
    private router: Router
  ) {}

  toggleDarkMode() {
      this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  logout() {
    // this.authService.logout();
    this.router.navigate(['/login']);
  }
}
