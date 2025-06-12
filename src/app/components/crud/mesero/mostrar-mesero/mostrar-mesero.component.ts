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
import { MeseroService } from '../../../../services/mesero.service';
import { Mesero } from '../../../../models/mesero.model';

interface Column {
  field: string;
  header: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-mostrar-mesero',
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
  templateUrl: './mostrar-mesero.component.html',
  styleUrl: './mostrar-mesero.component.css'
})
export class MostrarMeseroComponent implements OnInit {
  meseroDialog: boolean = false;
  meseros = signal<Mesero[]>([]);
  mesero!: Mesero;
  selectedMeseros!: Mesero[] | null;
  submitted: boolean = false;
  cols!: Column[];
  exportColumns!: ExportColumn[];

  @ViewChild('dt') dt!: Table;

  constructor(
    private meseroService: MeseroService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.initializeColumns();
    this.loadMeseros();
  }

  initializeColumns() {
    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'documento', header: 'Documento' },
      { field: 'turno', header: 'Turno' }
    ];
    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  loadMeseros() {
    this.meseroService.getMeseros().subscribe({
      next: (response: any) => {
        const lista = response.meseros ?? response.mesero ?? response;
        this.meseros.set(lista);
      },
      error: (error) => {
        console.error('Error al cargar meseros:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los meseros',
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
    this.mesero = {
      id_mesero: 0,
      nombre: '',
      documento: '',
      turno: ''
    };
    this.submitted = false;
    this.meseroDialog = true;
  }

  editMesero(mesero: Mesero) {
    this.mesero = { ...mesero };
    this.submitted = false;
    this.meseroDialog = true;
  }

  hideDialog() {
    this.meseroDialog = false;
    this.submitted = false;
  }

  saveMesero() {
    this.submitted = true;

    if (
      this.mesero.nombre?.trim() &&
      this.mesero.documento?.trim() &&
      this.mesero.turno?.trim()
    ) {
      if (this.mesero.id_mesero) {
        this.meseroService.updateMesero(this.mesero.id_mesero, this.mesero).subscribe({
          next: () => {
            this.loadMeseros();
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Mesero actualizado',
              life: 3000
            });
            this.meseroDialog = false;
            this.mesero = {} as Mesero;
          },
          error: (error) => {
            console.error('Error al actualizar mesero:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar el mesero',
              life: 3000
            });
          }
        });
      } else {
        this.meseroService.createMesero(this.mesero).subscribe({
          next: () => {
            this.loadMeseros();
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Mesero creado',
              life: 3000
            });
            this.meseroDialog = false;
            this.mesero = {} as Mesero;
          },
          error: (error) => {
            console.error('Error al crear mesero:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al crear el mesero',
              life: 3000
            });
          }
        });
      }
    }
  }

  deleteMesero(mesero: Mesero) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar a ' + mesero.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.meseroService.deleteMesero(mesero.id_mesero).subscribe({
          next: () => {
            this.loadMeseros();
            this.mesero = {} as Mesero;
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Mesero eliminado',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error al eliminar mesero:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el mesero',
              life: 3000
            });
          }
        });
      }
    });
  }

  deleteSelectedMeseros() {
    if (!this.selectedMeseros || !this.selectedMeseros.length) {
      return;
    }
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar los meseros seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const observables = this.selectedMeseros!.map(mesero =>
          this.meseroService.deleteMesero(mesero.id_mesero).toPromise()
        );
        Promise.all(observables)
          .then(() => {
            this.loadMeseros();
            this.selectedMeseros = null;
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Meseros eliminados',
              life: 3000
            });
          })
          .catch(error => {
            console.error('Error eliminando meseros seleccionados:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar los meseros seleccionados',
              life: 3000
            });
          });
      }
    });
  }
}
