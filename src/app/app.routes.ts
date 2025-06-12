import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { MostrarClienteComponent } from './components/crud/cliente/mostrar-cliente/mostrar-cliente.component';
import { MostrarMeseroComponent } from './components/crud/mesero/mostrar-mesero/mostrar-mesero.component';
import { MostrarMenuComponent } from './components/crud/menu/mostrar-menu/mostrar-menu.component';
import { MostrarMesaComponent } from './components/crud/mesa/mostrar-mesa/mostrar-mesa.component';
import { MostrarRepartidorComponent } from './components/crud/repartidor/mostrar-repartidor/mostrar-repartidor.component';
import { MostrarPedidoComponent } from './components/crud/pedido/mostrar-pedido/mostrar-pedido.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: "login", component: LoginComponent, canActivate: [LoginGuard] },
    { path: 'layout', component: LayoutComponent, canActivate: [AuthGuard], children: [
        { path: '', redirectTo: 'clientes', pathMatch: 'full' },
        { path: "clientes", component: MostrarClienteComponent },
        { path: "meseros", component: MostrarMeseroComponent },
        { path: "menu", component: MostrarMenuComponent },
        { path: "mesas", component: MostrarMesaComponent },
        { path: "repartidores", component: MostrarRepartidorComponent },
        { path: "pedidos", component: MostrarPedidoComponent },
    ] },
    
    { path: '**', redirectTo: 'login' },

];

