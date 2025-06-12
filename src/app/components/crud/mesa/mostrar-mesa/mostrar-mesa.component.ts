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
import { MesaService } from '../../../../services/mesa.service';
import { Mesa } from '../../../../models/mesa.model';

interface Column {
  field: string;
  header: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-mostrar-mesa',
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
  templateUrl: './mostrar-mesa.component.html',
  styleUrls: ['./mostrar-mesa.component.css']
})
export class MostrarMesaComponent implements OnInit {
  mesaDialog: boolean = false;
  mesas = signal<Mesa[]>([]);
  mesa!: Mesa;
  selectedMesas!: Mesa[] | null;
  submitted: boolean = false;
  cols!: Column[];
  exportColumns!: ExportColumn[];

  @ViewChild('dt') dt!: Table;

  constructor(
    private mesaService: MesaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.initializeColumns();
    this.loadMesas();
  }

  initializeColumns() {
    this.cols = [
      { field: 'numero', header: 'Número' },
      { field: 'ubicacion', header: 'Ubicación' }
    ];
    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  loadMesas() {
    this.mesaService.getMesas().subscribe({
      next: (data) => {
        this.mesas.set(data);
      },
      error: (err) => {
        console.error('Error al cargar mesas:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las mesas',
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
    this.mesa = {
      id: 0,
      numero: 0,
      ubicacion: ''
    };
    this.submitted = false;
    this.mesaDialog = true;
  }

  editMesa(mesa: Mesa) {
    this.mesa = { ...mesa };
    this.submitted = false;
    this.mesaDialog = true;
  }

  hideDialog() {
    this.mesaDialog = false;
    this.submitted = false;
  }

  saveMesa() {
    this.submitted = true;
    if (this.mesa.numero != null && this.mesa.ubicacion?.trim()) {
      if (this.mesa.id) {
        // Actualizar
        const updateData = { numero: this.mesa.numero, ubicacion: this.mesa.ubicacion };
        this.mesaService.updateMesa(this.mesa.id, updateData).subscribe({
          next: () => {
            this.loadMesas();
            this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Mesa actualizada', life: 3000 });
            this.hideDialog();
          },
          error: (err) => {
            console.error('Error actualizando mesa:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la mesa', life: 3000 });
          }
        });
      } else {
        // Crear
        const createData = { numero: this.mesa.numero, ubicacion: this.mesa.ubicacion };
        this.mesaService.createMesa(createData).subscribe({
          next: () => {
            this.loadMesas();
            this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Mesa creada', life: 3000 });
            this.hideDialog();
          },
          error: (err) => {
            console.error('Error creando mesa:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la mesa', life: 3000 });
          }
        });
      }
    }
  }

  deleteMesa(mesa: Mesa) {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la mesa #${mesa.numero}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.mesaService.deleteMesa(mesa.id).subscribe({
          next: () => {
            this.loadMesas();
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Mesa eliminada', life: 3000 });
          },
          error: (err) => {
            console.error('Error eliminando mesa:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la mesa', life: 3000 });
          }
        });
      }
    });
  }

  deleteSelectedMesas() {
    if (!this.selectedMesas?.length) return;
    this.confirmationService.confirm({
      message: '¿Eliminar las mesas seleccionadas?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ops = this.selectedMesas!.map(m =>
          this.mesaService.deleteMesa(m.id).toPromise()
        );
        Promise.all(ops)
          .then(() => {
            this.loadMesas();
            this.selectedMesas = null;
            this.messageService.add({ severity: 'success', summary: 'Eliminados', detail: 'Mesas eliminadas', life: 3000 });
          })
          .catch(err => {
            console.error('Error eliminando mesas:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todas las mesas', life: 3000 });
          });
      }
    });
  }
}
