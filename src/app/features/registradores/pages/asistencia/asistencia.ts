import { httpResource } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import API_ROUTES from '../../../../core/routes/api.routes';
import { Asistencia, AsistenciaBrigadaActivaResponse } from '../../../registro/interfaces/asistencia.interface';

@Component({
  selector: 'app-asistencia',
  imports: [CommonModule, FormsModule, DatePipe],
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
}
