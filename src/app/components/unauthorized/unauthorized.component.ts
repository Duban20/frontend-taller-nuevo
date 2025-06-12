import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center mt-5">
      <h2>Acceso denegado</h2>
      <p>No tienes permisos para acceder a esta sección.</p>
    </div>
  `
})
export class UnauthorizedComponent {}