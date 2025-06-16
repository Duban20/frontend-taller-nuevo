import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuitemComponent } from '../menuitem/menuitem.component';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, MenuitemComponent, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  model: MenuItem[] = [];

  ngOnInit() {
      this.model = [
        
          
          {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            routerLink: ['/pages'],
            items: [
                {
                    label: 'Inicio',
                    icon: 'pi pi-fw pi-home',
                    routerLink: ['/layout/inicio']
                },
                {
                    label: 'Clientes',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/layout/clientes']
                },
                {
                    label: 'Meseros',
                    icon: 'pi pi-fw pi-id-card',
                    routerLink: ['/layout/meseros']
                },
                {
                    label: 'Repartidores',
                    icon: 'pi pi-fw pi-truck',
                    routerLink: ['/layout/repartidores']
                }, 
                {
                    label: 'Pedidos',
                    icon: 'pi pi-fw pi-shopping-cart',
                    routerLink: ['/layout/pedidos']
                },
                {
                    label: 'Menu',
                    icon: 'pi pi-fw pi-bars',
                    routerLink: ['/layout/menu']
                },
                {
                    label: 'Mesas',
                    icon: 'pi pi-fw pi-table',
                    routerLink: ['/layout/mesas']
                },
                //   {
                //       label: 'Auth',
                //       icon: 'pi pi-fw pi-user',
                //       items: [
                //           {
                //               label: 'Login',
                //               icon: 'pi pi-fw pi-sign-in',
                //               routerLink: ['/auth/login']
                //           },
                //           {
                //               label: 'Error',
                //               icon: 'pi pi-fw pi-times-circle',
                //               routerLink: ['/auth/error']
                //           },
                //           {
                //               label: 'Access Denied',
                //               icon: 'pi pi-fw pi-lock',
                //               routerLink: ['/auth/access']
                //           }
                //       ]
                //   },
                 
                  
              
              ]
          },
         
      ];
  }
}
