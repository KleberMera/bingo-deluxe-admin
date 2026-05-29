import { httpResource } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import API_ROUTES from '../../../../core/routes/api.routes';
import { Asistencia, AsistenciaBrigadaActivaResponse } from '../../../registro/interfaces/asistencia.interface';
import { exportToExcel, sanitizeFileName } from '../../../../shared/utils/excel-export';

@Component({
  selector: 'app-asistencia',
  imports: [CommonModule, FormsModule],
  templateUrl: './asistencia.html',
  styleUrl: './asistencia.css',
})
export default class AsistenciaPage {
  listResource = httpResource<AsistenciaBrigadaActivaResponse>(() => API_ROUTES.ASISTENCIA_BRIGADA_ACTIVA);

  searchTerm = signal('');

  brigadaActiva = computed(() => this.listResource.value()?.brigada_activa ?? null);

  asistencias = computed(() => this.listResource.value()?.data ?? []);

  filteredAsistencias = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const data = this.asistencias();

    if (!search) {
      return data;
    }

    return data.filter((item) => {
      const fullName = `${item.nombres} ${item.apellidos}`.toLowerCase();
      return (
        fullName.includes(search) ||
        item.cedula.includes(search) ||
        item.celular.includes(search)
      );
    });
  });

  apiMessage = computed(() => this.listResource.value()?.message ?? '');

  hasApiError = computed(() => {
    const response = this.listResource.value();
    return response !== undefined && !response.success;
  });

  reloadData(): void {
    this.listResource.reload();
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  nombreCompleto(item: Asistencia): string {
    return `${item.nombres} ${item.apellidos}`;
  }

  canExport(): boolean {
    return !this.listResource.isLoading() && !this.hasApiError() && this.filteredAsistencias().length > 0;
  }

  exportarExcel(): void {
    const items = this.filteredAsistencias();

    if (items.length === 0) {
      toast.warning('No hay datos para exportar.');
      return;
    }

    const rows = items.map((item, index) => ({
      '#': index + 1,
      Nombres: item.nombres,
      Apellidos: item.apellidos,
      Cédula: item.cedula,
      Celular: item.celular,
      Brigada: item.nombre_brigada,
      'Fecha registro': this.formatFechaRegistro(item.created_at),
    }));

    const brigadaNombre = this.brigadaActiva()?.nombre_brigada ?? 'asistencia';
    const fecha = new Date().toISOString().slice(0, 10);
    const fileName = `asistencia_${sanitizeFileName(brigadaNombre)}_${fecha}`;

    exportToExcel(rows, fileName, 'Asistencia');
    toast.success('Archivo Excel descargado.');
  }

  formatFechaRegistro(iso: string): string {
    const fecha = new Date(iso);

    if (Number.isNaN(fecha.getTime())) {
      return iso;
    }

    const partes = new Intl.DateTimeFormat('es-EC', {
      timeZone: 'America/Guayaquil',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(fecha);

    const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
      partes.find((p) => p.type === tipo)?.value ?? '';

    return `${valor('day')}/${valor('month')}/${valor('year')} ${valor('hour')}:${valor('minute')}`;
  }
}
