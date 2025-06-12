import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { EstadoPedidoService } from '../../../services/estadoPedido.service';
import { EstadoPedido } from '../../../models/estado-pedido.model';

import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-estado-pedido',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    DropdownModule,
    CalendarModule,
    ButtonModule
  ],
  templateUrl: './estado-pedido.component.html',
  styleUrls: ['./estado-pedido.component.css']
})
export class EstadoPedidoComponent implements OnInit {
  @Input() pedidoId!: number;

  public estados: EstadoPedido[] = [];
  public form!: FormGroup;

  // Conservamos lista base y la actualizamos con disabled
  private allOpcionesEstados = [
    { label: 'Preparación', value: 'Preparación' },
    { label: 'Listo',        value: 'Listo'        },
    { label: 'Enviado',      value: 'Enviado'      },
    { label: 'Entregado',    value: 'Entregado'    }
  ];
  public opcionesEstados: { label: string; value: string; disabled?: boolean }[] = [];

  private fb = inject(FormBuilder);
  private estadoService = inject(EstadoPedidoService);

  ngOnInit(): void {
    this.form = this.fb.group({
      estado:     [null, Validators.required],
      fecha_hora: [null, Validators.required],
      id_pedido:  [this.pedidoId, Validators.required]
    });

    this.loadEstados();
  }

  loadEstados(): void {
    this.estadoService.getEstadosByPedido(this.pedidoId).subscribe({
      next: (data) => {
        this.estados = data;
        // Actualizamos opciones para deshabilitar ya usados
        const usados = this.estados.map(e => e.estado);
        this.opcionesEstados = this.allOpcionesEstados.map(opt => ({
          ...opt,
          disabled: usados.includes(opt.value)
        }));
        // Reset de selección si actual ahora inválido
        const sel = this.form.get('estado')!.value;
        if (sel && usados.includes(sel)) {
          this.form.get('estado')!.setValue(null);
        }
      },
      error: (err) => console.error('Error cargando estados:', err)
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.estadoService.createEstado(this.form.value).subscribe({
      next: () => {
        this.form.patchValue({ estado: null, fecha_hora: null });
        this.loadEstados();
      },
      error: (err) => console.error('Error creando estado:', err)
    });
  }
}