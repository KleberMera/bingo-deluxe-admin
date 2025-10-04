import { httpResource } from '@angular/common/http';

import { Component, computed, inject, signal } from '@angular/core';

import { apiResponse } from '../../../../core/interfaces/apiResponse';
import { Registrador } from '../../../../core/interfaces/registrador';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { Message } from 'primeng/message';
import { DataView } from 'primeng/dataview';

import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { RegistradorFormModalComponent } from '../../components/registrador-form-modal.component';
import { ConfirmDeleteModalComponent } from '../../components/confirm-delete-modal.component';
import { srvRegistradores } from '../../services/registradores';

type TabType = 'todos' | 'conTipo' | 'sinTipo' | 'activos' | 'inactivos';

@Component({
  selector: 'app-registradores',
  imports: [CommonModule, FormsModule, RegistradorFormModalComponent, ConfirmDeleteModalComponent],
  templateUrl: './registradores.html',
  styleUrl: './registradores.css',
})
export default class Registradores {
  urlApi = environment.apiUrl;
  private srvRegistradores = inject(srvRegistradores);

  listRegResource = httpResource<apiResponse<Registrador[]>>(() => `${this.urlApi}/registrador`);

  // Signals para el estado de la UI
  activeTab = signal<TabType>('todos');
  searchTerm = signal<string>('');
  
  // Signals para el modal de formulario
  showModal = signal(false);
  editingRegistrador = signal<Registrador | null>(null);

  // Signals para el modal de confirmación
  showDeleteModal = signal(false);
  deletingRegistrador = signal<Registrador | null>(null);

  // Computed para filtrar los registradores
  filteredRegistradores = computed(() => {
    const data = this.listRegResource.value()?.data || [];
    const tab = this.activeTab();
    const search = this.searchTerm().toLowerCase().trim();

    // Primero filtrar por búsqueda
    let filtered = data;
    if (search) {
      filtered = data.filter(reg => 
        reg.nombre_registrador.toLowerCase().includes(search) ||
        reg.id.toString().includes(search) ||
        reg.tipo?.nombre_tipo?.toLowerCase().includes(search)
      );
    }

    // Luego filtrar por tab
    switch (tab) {
      case 'conTipo':
        return filtered.filter(reg => reg.tipo !== null);
      case 'sinTipo':
        return filtered.filter(reg => reg.tipo === null);
      case 'activos':
        return filtered.filter(reg => reg.tipo?.activo === true);
      case 'inactivos':
        return filtered.filter(reg => reg.tipo?.activo === false);
      default:
        return filtered;
    }
  });

  // Computed para estadísticas
  stats = computed(() => {
    const data = this.listRegResource.value()?.data || [];
    return {
      total: data.length,
      conTipo: data.filter(reg => reg.tipo !== null).length,
      sinTipo: data.filter(reg => reg.tipo === null).length,
      activos: data.filter(reg => reg.tipo?.activo === true).length,
      inactivos: data.filter(reg => reg.tipo?.activo === false).length
    };
  });

  // Método para cambiar de tab
  setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  // Método para actualizar búsqueda
  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  // Método para abrir modal de nuevo registrador
  openNewRegistradorModal(): void {
    this.editingRegistrador.set(null);
    this.showModal.set(true);
  }

  // Método para ver detalles
  viewDetails(registrador: Registrador): void {
    console.log('Ver detalles de:', registrador);
    // Implementar lógica de detalles si es necesario
  }

  // Método para editar
  editRegistrador(registrador: Registrador): void {
    this.editingRegistrador.set(registrador);
    this.showModal.set(true);
  }

  // Método para eliminar
  deleteRegistrador(registrador: Registrador): void {
    this.deletingRegistrador.set(registrador);
    this.showDeleteModal.set(true);
  }

  // Método para recargar datos
  reloadData(): void {
    this.listRegResource.reload();
  }

  // Métodos del modal de formulario
  onModalClose(): void {
    this.showModal.set(false);
    this.editingRegistrador.set(null);
  }

  onRegistradorSaved(registrador: Registrador): void {
    console.log('Registrador guardado:', registrador);
    this.reloadData(); // Recargar la lista
    // Aquí podrías mostrar un mensaje de éxito
  }

  // Métodos del modal de confirmación
  onDeleteModalClose(): void {
    this.showDeleteModal.set(false);
    this.deletingRegistrador.set(null);
  }

  onRegistradorDeleted(registrador: Registrador): void {
    console.log('Registrador eliminado:', registrador);
    this.reloadData(); // Recargar la lista
    // Aquí podrías mostrar un mensaje de éxito
  }
}
