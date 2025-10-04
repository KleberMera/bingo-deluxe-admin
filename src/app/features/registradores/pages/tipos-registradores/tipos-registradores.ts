import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { httpResource } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { apiResponse } from '../../../../core/interfaces/apiResponse';
import { TipoRegistrador } from '../../interfaces/tipo-registrador.interface';
import { srvTiposRegistradores } from '../../services/tipos-registradores';
import { TipoRegistradorFormModalComponent } from '../../components/tipo-registrador-form-modal.component';
import { ConfirmDeleteTipoModalComponent } from '../../components/confirm-delete-tipo-modal/confirm-delete-tipo-modal.component';
import { firstValueFrom } from 'rxjs';

type TabType = 'todos' | 'activos' | 'inactivos';

@Component({
  selector: 'app-tipos-registradores',
  imports: [CommonModule, FormsModule, TipoRegistradorFormModalComponent, ConfirmDeleteTipoModalComponent],
  templateUrl: './tipos-registradores.html',
  styleUrl: './tipos-registradores.css'
})
export default class TiposRegistradores {
  urlApi = environment.apiUrl;
  private srvTiposRegistradores = inject(srvTiposRegistradores);

  listTiposResource = httpResource<apiResponse<TipoRegistrador[]>>(() => `${this.urlApi}/tipos-registradores`);

  // Signals para el estado de la UI
  activeTab = signal<TabType>('todos');
  searchTerm = signal<string>('');
  
  // Signals para el modal de formulario
  showModal = signal(false);
  editingTipo = signal<TipoRegistrador | null>(null);

  // Signals para el modal de confirmación
  showDeleteModal = signal(false);
  deletingTipo = signal<TipoRegistrador | null>(null);

  // Computed para filtrar los tipos
  filteredTipos = computed(() => {
    const data = this.listTiposResource.value()?.data || [];
    const tab = this.activeTab();
    const search = this.searchTerm().toLowerCase().trim();

    // Primero filtrar por búsqueda
    let filtered = data;
    if (search) {
      filtered = data.filter(tipo => 
        tipo.nombre_tipo.toLowerCase().includes(search) ||
        tipo.id.toString().includes(search) ||
        tipo.descripcion?.toLowerCase().includes(search)
      );
    }

    // Luego filtrar por tab
    switch (tab) {
      case 'activos':
        return filtered.filter(tipo => tipo.activo === true);
      case 'inactivos':
        return filtered.filter(tipo => tipo.activo === false);
      default:
        return filtered;
    }
  });

  // Computed para estadísticas
  stats = computed(() => {
    const data = this.listTiposResource.value()?.data || [];
    return {
      total: data.length,
      activos: data.filter(tipo => tipo.activo === true).length,
      inactivos: data.filter(tipo => tipo.activo === false).length
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

  // Método para abrir modal de nuevo tipo
  openNewTipoModal(): void {
    this.editingTipo.set(null);
    this.showModal.set(true);
  }

  // Método para editar
  editTipo(tipo: TipoRegistrador): void {
    this.editingTipo.set(tipo);
    this.showModal.set(true);
  }

  // Método para eliminar
  deleteTipo(tipo: TipoRegistrador): void {
    this.deletingTipo.set(tipo);
    this.showDeleteModal.set(true);
  }

  // Método para cambiar estado
  async toggleEstado(tipo: TipoRegistrador): Promise<void> {
    try {
      await firstValueFrom(this.srvTiposRegistradores.toggleEstado(tipo.id));
      this.reloadData();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  }

  // Método para recargar datos
  reloadData(): void {
    this.listTiposResource.reload();
  }

  // Métodos del modal de formulario
  onModalClose(): void {
    this.showModal.set(false);
    this.editingTipo.set(null);
  }

  onTipoSaved(tipo: TipoRegistrador): void {
    console.log('Tipo guardado:', tipo);
    this.reloadData();
  }

  // Métodos del modal de confirmación
  onDeleteModalClose(): void {
    this.showDeleteModal.set(false);
    this.deletingTipo.set(null);
  }

  onTipoDeleted(tipo: TipoRegistrador): void {
    this.srvTiposRegistradores.eliminarTipo(tipo.id).subscribe({
      next: () => {
        console.log('Tipo eliminado:', tipo);
        this.showDeleteModal.set(false);
        this.deletingTipo.set(null);
        this.reloadData();
      },
      error: (error: any) => {
        console.error('Error al eliminar tipo:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }
}
