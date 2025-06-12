import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PedidoService } from '../../../../services/pedido.service';
import { Pedido } from '../../../../models/pedido.model';

interface Column {
  field: string;
  header: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-mostrar-pedido',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './mostrar-pedido.component.html',
  styleUrls: ['./mostrar-pedido.component.css']
})
export class MostrarPedidoComponent implements OnInit {
  // diálogo de crear/editar
  pedidoDialog: boolean = false;
  // lista reactiva de pedidos
  pedidos = signal<Pedido[]>([]);
  // pedido actual (crear/editar)
  pedido!: Pedido;
  // selección múltiple
  selectedPedidos!: Pedido[] | null;
  // flag de validación
  submitted: boolean = false;
  // columnas para tabla y export
  cols!: Column[];
  exportColumns!: ExportColumn[];

  @ViewChild('dt') dt!: Table;

  constructor(
    private pedidoService: PedidoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.initializeColumns();
    this.loadPedidos();
  }

  initializeColumns() {
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'tipo_pedido', header: 'Tipo' },
      { field: 'tiempo_estimado_preparacion', header: 'Prep. (min)' },
      { field: 'tiempo_estimado_entrega', header: 'Ent. (min)' },
      { field: 'estado_actual', header: 'Estado' },
      { field: 'fecha_hora', header: 'Fecha / Hora' },
      { field: 'cliente.nombre', header: 'Cliente' },
      { field: 'mesa.numero', header: 'Mesa' },
      { field: 'mesero.nombre', header: 'Mesero' },
      { field: 'repartidor?.nombre', header: 'Repartidor' }
    ];
    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  loadPedidos() {
    this.pedidoService.getPedidos().subscribe({
      next: ({ pedidos }) => this.pedidos.set(pedidos),
      error: err => {
        console.error('Error al cargar pedidos:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los pedidos', life: 3000 });
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  openNew() {
    this.pedido = {
      id: 0,
      tipo_pedido: '',
      fecha_hora: new Date().toISOString(),
      tiempo_estimado_preparacion: 0,
      tiempo_estimado_entrega: 0,
      estado_actual: '',
      id_clientes: 0,
      id_mesa: 0,
      id_mesero: null,
      id_repartidor: null,
      cliente: {} as any,
      mesa: {} as any,
      mesero: {} as any,
      repartidor: null,
      estados: [],
      pedido_menus: []
    };
    this.submitted = false;
    this.pedidoDialog = true;
  }

  editPedido(p: Pedido) {
    this.pedido = { ...p };
    this.submitted = false;
    this.pedidoDialog = true;
  }

  hideDialog() {
    this.pedidoDialog = false;
    this.submitted = false;
  }

  savePedido() {
    this.submitted = true;
    // validación mínima
    if (this.pedido.tipo_pedido?.trim() && this.pedido.estado_actual?.trim()) {
      if (this.pedido.id) {
        this.pedidoService.updatePedido(this.pedido.id, this.pedido).subscribe({
          next: () => {
            this.loadPedidos();
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Pedido actualizado', life: 3000 });
            this.hideDialog();
          },
          error: err => {
            console.error('Error al actualizar pedido:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el pedido', life: 3000 });
          }
        });
      } else {
        this.pedidoService.createPedido(this.pedido).subscribe({
          next: () => {
            this.loadPedidos();
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Pedido creado', life: 3000 });
            this.hideDialog();
          },
          error: err => {
            console.error('Error al crear pedido:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el pedido', life: 3000 });
          }
        });
      }
    }
  }

  deletePedido(p: Pedido) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar el pedido #${p.id}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.pedidoService.deletePedido(p.id).subscribe({
          next: () => {
            this.loadPedidos();
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Pedido eliminado', life: 3000 });
          },
          error: err => {
            console.error('Error al eliminar pedido:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el pedido', life: 3000 });
          }
        });
      }
    });
  }

  deleteSelectedPedidos() {
    if (!this.selectedPedidos || !this.selectedPedidos.length) return;
    this.confirmationService.confirm({
      message: '¿Eliminar todos los pedidos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const proms = this.selectedPedidos!.map(p => this.pedidoService.deletePedido(p.id).toPromise());
        Promise.all(proms)
          .then(() => {
            this.loadPedidos();
            this.selectedPedidos = null;
            this.messageService.add({ severity: 'success', summary: 'Eliminados', detail: 'Pedidos eliminados', life: 3000 });
          })
          .catch(err => {
            console.error('Error borrando pedidos:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todos los pedidos', life: 3000 });
          });
      }
    });
  }
}
