
import { Component, ChangeDetectorRef } from '@angular/core';
import { ResumenTipoRegistradorService, ResumenTipoRegistradorItem } from '../../services/resumen-tipo-registrador.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    AvatarModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export default class Home {
  resumen: ResumenTipoRegistradorItem[] = [];
  resumenLoading = false;
  resumenError: string | null = null;

  get totalRegistros(): number {
    return this.resumen.reduce((acc, item) => acc + (item.CANTIDAD_REGISTROS || 0), 0);
  }

  get totalTablas(): number {
    return this.resumen.reduce((acc, item) => acc + (parseInt(item.CANTIDAD_TABLAS) || 0), 0);
  }

  stats = [
    { title: 'Total Registros', value: () => this.totalRegistros, icon: 'pi pi-database', color: 'text-green-500' },
    { title: 'Total Tablas', value: () => this.totalTablas, icon: 'pi pi-table', color: 'text-blue-500' },
    { title: '-----', value: '----', icon: 'pi pi-dollar', color: 'text-purple-500' },
    { title: '----', value: '----', icon: 'pi pi-grid', color: 'text-orange-500' }
  
  ];

  constructor(private resumenService: ResumenTipoRegistradorService, private cdr: ChangeDetectorRef) {
    this.cargarResumen();
  }

  cargarResumen() {
    this.resumenLoading = true;
    this.resumenError = null;
    this.resumenService.getResumen().subscribe({
      next: (resp) => {
        this.resumenLoading = false;
        if (resp.success && resp.data) {
          this.resumen = resp.data;
        } else {
          this.resumenError = resp.message || 'No se pudo cargar el resumen';
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.resumenLoading = false;
        this.resumenError = 'Error al cargar el resumen';
        this.cdr.detectChanges();
      }
    });
  }
}
