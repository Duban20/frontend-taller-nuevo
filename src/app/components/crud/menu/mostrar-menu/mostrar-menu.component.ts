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
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';        
import { IconFieldModule } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputIconModule } from 'primeng/inputicon';
import { MenuService } from '../../../../services/menu.service';
import { Menu } from '../../../../models/menu.model';

interface Column {
  field: string;
  header: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-mostrar-menu',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    InputNumberModule,
    InputSwitchModule,               
    IconFieldModule,
    DialogModule,
    ConfirmDialogModule,
    InputIconModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './mostrar-menu.component.html',
  styleUrls: ['./mostrar-menu.component.css']
})
export class MostrarMenuComponent implements OnInit {
  menuDialog = false;
  menus = signal<Menu[]>([]);
  menu!: Menu;
  selectedMenus!: Menu[] | null;
  submitted = false;
  cols!: Column[];
  exportColumns!: ExportColumn[];

  @ViewChild('dt') dt!: Table;

  constructor(
    private menuService: MenuService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.loadMenus();
  }

  initializeColumns() {
    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'precio', header: 'Precio' },
      { field: 'disponible', header: 'Disponible' }  
    ];
    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  loadMenus(): void {
    this.menuService.getMenus().subscribe({
      next: (data: Menu[]) => this.menus.set(data),
      error: err => {
        console.error('Error al cargar menús:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los menús',
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
    this.menu = {
      id: 0,
      nombre: '',
      descripcion: '',
      precio: 0,
      disponible: false   
    };
    this.submitted = false;
    this.menuDialog = true;
  }

  editMenu(menu: Menu) {
    this.menu = { ...menu };
    this.submitted = false;
    this.menuDialog = true;
  }

  hideDialog() {
    this.menuDialog = false;
    this.submitted = false;
  }

  saveMenu() {
    this.submitted = true;
    if (
      this.menu.nombre?.trim() &&
      this.menu.descripcion?.trim() &&
      this.menu.precio > 0
    ) {
      const action$ = this.menu.id
        ? this.menuService.updateMenu(this.menu.id, this.menu)
        : this.menuService.createMenu(this.menu);

      action$.subscribe({
        next: () => {
          this.loadMenus();
          this.messageService.add({
            severity: 'success',
            summary: 'Exitoso',
            detail: this.menu.id ? 'Menú actualizado' : 'Menú creado',
            life: 3000
          });
          this.menuDialog = false;
        },
        error: err => {
          console.error('Error al guardar menú:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo guardar el menú',
            life: 3000
          });
        }
      });
    }
  }

  deleteMenu(menu: Menu) {
    this.confirmationService.confirm({
      message: `¿Eliminar el menú "${menu.nombre}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.menuService.deleteMenu(menu.id).subscribe({
          next: () => {
            this.loadMenus();
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Menú eliminado',
              life: 3000
            });
          },
          error: err => {
            console.error('Error al eliminar menú:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el menú',
              life: 3000
            });
          }
        });
      }
    });
  }

  deleteSelectedMenus() {
    if (!this.selectedMenus || !this.selectedMenus.length) return;
    this.confirmationService.confirm({
      message: '¿Eliminar los menús seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const promises = this.selectedMenus!.map(m =>
          this.menuService.deleteMenu(m.id).toPromise()
        );
        Promise.all(promises)
          .then(() => {
            this.loadMenus();
            this.selectedMenus = null;
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Menús eliminados',
              life: 3000
            });
          })
          .catch(err => {
            console.error('Error eliminando menús:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudieron eliminar todos los menús',
              life: 3000
            });
          });
      }
    });
  }
}
