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
import { ClienteService } from '../../../../services/cliente.service';
import { Cliente } from '../../../../models/cliente.model';

interface Column {
  field: string;
  header: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-mostrar-cliente',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
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
  templateUrl: './mostrar-cliente.component.html',
  styleUrl: './mostrar-cliente.component.css'
})
export class MostrarClienteComponent implements OnInit {
  // Control del diálogo de nuevo/editar
  clienteDialog: boolean = false;

  // Lista de clientes como signal para reactividad
  clientes = signal<Cliente[]>([]);

  // Cliente actual para crear/editar
  cliente!: Cliente;

  // Selección en la tabla
  selectedClientes!: Cliente[] | null;

  // Para validación simple
  submitted: boolean = false;

  // Columnas para la tabla y exportación
  cols!: Column[];
  exportColumns!: ExportColumn[];

  // Referencia al Table para exportar CSV y filtrado
  @ViewChild('dt') dt!: Table;

  constructor(
    private clienteService: ClienteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.initializeColumns();
    this.loadClientes();
  }

  // Definir columnas según modelo Cliente
  initializeColumns() {
    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'direccion', header: 'Dirección' },
      { field: 'telefono', header: 'Teléfono' },
      { field: 'correo', header: 'Correo' }
    ];
    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  // Cargar lista de clientes
  loadClientes() {
    this.clienteService.getClientes().subscribe({
      next: (response: any) => {
        // Asumimos que el servicio devuelve { clientes: Cliente[] } o similar.
        // Ajusta según tu API: aquí usamos response.clientes o response.data, según corresponda.
        const lista = response.clientes ?? response.cliente ?? response;
        this.clientes.set(lista);
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los clientes',
          life: 3000
        });
      }
    });
  }

  // Filtro global
  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // Exportar CSV
  exportCSV() {
    this.dt.exportCSV();
  }

  // Abrir diálogo para nuevo cliente
  openNew() {
    this.cliente = {
      // Inicializar con campos vacíos; si tu modelo Cliente tiene más campos, agrégalos aquí.
      nombre: '',
      direccion: '',
      telefono: '',
      correo: ''
    } as Cliente;
    this.submitted = false;
    this.clienteDialog = true;
  }

  // Abrir diálogo para editar
  editCliente(cliente: Cliente) {
    this.cliente = { ...cliente };
    this.submitted = false;
    this.clienteDialog = true;
  }

  // Ocultar diálogo
  hideDialog() {
    this.clienteDialog = false;
    this.submitted = false;
  }

  // Guardar (crear o actualizar)
  saveCliente() {
    this.submitted = true;

    // Validación básica: verificar que los campos requeridos no estén vacíos
    if (
      this.cliente.nombre?.trim() &&
      this.cliente.direccion?.trim() &&
      this.cliente.telefono?.trim() &&
      this.cliente.correo?.trim()
    ) {
      if (this.cliente.id) {
        // Actualizar cliente existente
        this.clienteService.updateCliente(this.cliente.id, this.cliente).subscribe({
          next: () => {
            this.loadClientes();
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Cliente actualizado',
              life: 3000
            });
            this.clienteDialog = false;
            this.cliente = {} as Cliente;
          },
          error: (error) => {
            console.error('Error al actualizar cliente:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar el cliente',
              life: 3000
            });
          }
        });
      } else {
        // Crear nuevo cliente
        this.clienteService.createCliente(this.cliente).subscribe({
          next: () => {
            this.loadClientes();
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Cliente creado',
              life: 3000
            });
            this.clienteDialog = false;
            this.cliente = {} as Cliente;
          },
          error: (error) => {
            console.error('Error al crear cliente:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al crear el cliente',
              life: 3000
            });
          }
        });
      }
    }
    // Si falta algún campo, los mensajes de validación se muestran en el template
  }

  // Eliminar un cliente con confirmación
  deleteCliente(cliente: Cliente) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar a ' + cliente.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clienteService.deleteCliente(cliente.id!).subscribe({
          next: () => {
            this.loadClientes();
            this.cliente = {} as Cliente;
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Cliente eliminado',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error al eliminar cliente:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el cliente',
              life: 3000
            });
          }
        });
      }
    });
  }

  // Eliminar múltiples clientes seleccionados
  deleteSelectedClientes() {
    if (!this.selectedClientes || !this.selectedClientes.length) {
      return;
    }
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar los clientes seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Eliminar uno a uno; se pueden optimizar en backend con batch si existe
        const observables = this.selectedClientes!.map(cliente =>
          this.clienteService.deleteCliente(cliente.id!).toPromise()
        );
        Promise.all(observables)
          .then(() => {
            this.loadClientes();
            this.selectedClientes = null;
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Clientes eliminados',
              life: 3000
            });
          })
          .catch(error => {
            console.error('Error eliminando clientes seleccionados:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar los clientes seleccionados',
              life: 3000
            });
          });
      }
    });
  }
}
