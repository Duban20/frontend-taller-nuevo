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
import { RepartidorService } from '../../../../services/repartidor.service';
import { Repartidor } from '../../../../models/repartidor.model';

interface Column {
  field: string;
  header: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-mostrar-repartidor',
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
  templateUrl: './mostrar-repartidor.component.html',
  styleUrls: ['./mostrar-repartidor.component.css']
})
export class MostrarRepartidorComponent implements OnInit {
  repartidorDialog = false;
  repartidores = signal<Repartidor[]>([]);
  repartidor!: Repartidor;
  selectedRepartidores!: Repartidor[] | null;
  submitted = false;
  cols!: Column[];
  exportColumns!: ExportColumn[];

  @ViewChild('dt') dt!: Table;

  constructor(
    private repartidorService: RepartidorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.loadRepartidores();
  }

  private initializeColumns() {
    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'telefono', header: 'Teléfono' },
      { field: 'vehiculo', header: 'Vehículo' }
    ];
    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  private loadRepartidores() {
    this.repartidorService.getRepartidores().subscribe({
      next: (data: Repartidor[]) => this.repartidores.set(data),
      error: (err) => {
        console.error('Error al cargar repartidores:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los repartidores',
          life: 3000
        });
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
    this.repartidor = { id: 0, nombre: '', telefono: '', vehiculo: '' };
    this.submitted = false;
    this.repartidorDialog = true;
  }

  editRepartidor(rep: Repartidor) {
    this.repartidor = { ...rep };
    this.submitted = false;
    this.repartidorDialog = true;
  }

  hideDialog() {
    this.repartidorDialog = false;
    this.submitted = false;
  }

  saveRepartidor() {
    this.submitted = true;

    if (
      this.repartidor.nombre?.trim() &&
      this.repartidor.telefono?.trim() &&
      this.repartidor.vehiculo?.trim()
    ) {
      if (this.repartidor.id) {
        this.repartidorService
          .updateRepartidor(this.repartidor.id, this.repartidor)
          .subscribe({
            next: () => {
              this.loadRepartidores();
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Repartidor actualizado',
                life: 3000
              });
              this.hideDialog();
            },
            error: (err) => {
              console.error('Error al actualizar repartidor:', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar',
                life: 3000
              });
            }
          });
      } else {
        this.repartidorService.createRepartidor(this.repartidor).subscribe({
          next: () => {
            this.loadRepartidores();
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Repartidor creado',
              life: 3000
            });
            this.hideDialog();
          },
          error: (err) => {
            console.error('Error al crear repartidor:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear',
              life: 3000
            });
          }
        });
      }
    }
  }

  deleteRepartidor(rep: Repartidor) {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar a ${rep.nombre}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.repartidorService.deleteRepartidor(rep.id).subscribe({
          next: () => {
            this.loadRepartidores();
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Repartidor eliminado',
              life: 3000
            });
          },
          error: (err) => {
            console.error('Error al eliminar repartidor:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar',
              life: 3000
            });
          }
        });
      }
    });
  }

  deleteSelectedRepartidores() {
    if (!this.selectedRepartidores || !this.selectedRepartidores.length) {
      return;
    }
    this.confirmationService.confirm({
      message: '¿Eliminar todos los repartidores seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deletes = this.selectedRepartidores!.map(r =>
          this.repartidorService.deleteRepartidor(r.id).toPromise()
        );
        Promise.all(deletes)
          .then(() => {
            this.loadRepartidores();
            this.selectedRepartidores = null;
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Repartidores eliminados',
              life: 3000
            });
          })
          .catch((err) => {
            console.error('Error eliminando repartidores:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudieron eliminar todos',
              life: 3000
            });
          });
      }
    });
  }
}
