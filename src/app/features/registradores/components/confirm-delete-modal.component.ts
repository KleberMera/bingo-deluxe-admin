import { Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { srvRegistradores } from '../services/registradores';
import { Registrador } from '../../../core/interfaces/registrador';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible()) {
      <div 
        class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        (click)="onBackdropClick($event)">
        <div 
          class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all"
          (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Confirmar Eliminación
              </h3>
            </div>
          </div>

          <!-- Content -->
          <div class="px-6 py-4">
            @if (registrador(); as reg) {
              <p class="text-gray-700 dark:text-gray-300 mb-4">
                ¿Estás seguro de que deseas eliminar al registrador:
              </p>
              
              <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <div class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {{ reg.nombre_registrador }}
                </div>
                
                @if (reg.tipo) {
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Tipo:</span>
                    <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded text-xs font-medium">
                      {{ reg.tipo.nombre_tipo }}
                    </span>
                  </div>
                } @else {
                  <span class="text-sm text-gray-500 dark:text-gray-400 italic">Sin tipo asignado</span>
                }
              </div>

              <p class="text-red-700 dark:text-red-400 text-sm mt-4 font-medium">
                ⚠️ Esta acción no se puede deshacer.
              </p>
            }
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              type="button"
              (click)="onCancel()"
              [disabled]="eliminando()"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 
                     hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed">
              Cancelar
            </button>
            <button
              type="button"
              (click)="onConfirm()"
              [disabled]="eliminando()"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 
                     text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
                     inline-flex items-center gap-2">
              @if (eliminando()) {
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              }
              Eliminar
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmDeleteModalComponent {
  private srvRegistradores = inject(srvRegistradores);

  // Inputs
  isVisible = input<boolean>(false);
  registrador = input<Registrador | null>(null);

  // Outputs
  onClose = output<void>();
  onConfirmed = output<Registrador>();

  // Signals
  eliminando = signal(false);

  async onConfirm(): Promise<void> {
    const reg = this.registrador();
    if (!reg) return;

    this.eliminando.set(true);

    try {
      await firstValueFrom(this.srvRegistradores.eliminarRegistrador(reg.id));
      toast.success('Registrador eliminado exitosamente.');
      this.onConfirmed.emit(reg);
      this.onClose.emit();
    } catch (error) {
      console.error('Error al eliminar registrador:', error);
      // Aquí podrías mostrar un mensaje de error
    } finally {
      this.eliminando.set(false);
    }
  }

  onCancel(): void {
    this.onClose.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    // Solo cerrar si el clic fue directamente en el backdrop, no en sus hijos
    if (event.target === event.currentTarget) {
      this.onClose.emit();
    }
  }
}