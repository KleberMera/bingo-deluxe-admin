import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TipoRegistrador } from '../../interfaces/tipo-registrador.interface';

@Component({
  selector: 'app-confirm-delete-tipo-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Modal Backdrop -->
    @if (isVisible) {
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        (click)="onBackdropClick($event)"
        [@fadeIn]>
        
        <!-- Modal Container -->
        <div 
          class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-slate-200 dark:border-gray-700"
          (click)="$event.stopPropagation()"
          [@slideIn]>
          
          <!-- Header -->
          <div class="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-red-200 dark:border-red-800">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-red-900 dark:text-red-300">
                  Confirmar Eliminación
                </h3>
                <p class="text-red-700 dark:text-red-400 text-sm">
                  Esta acción no se puede deshacer
                </p>
              </div>
              <button 
                (click)="onClose.emit()"
                class="p-2 text-red-400 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6">
            @if (tipoData) {
              <div class="space-y-4">
                <p class="text-slate-600 dark:text-gray-300 leading-relaxed">
                  ¿Estás seguro de que deseas eliminar el tipo de registrador 
                  <span class="font-semibold text-slate-900 dark:text-gray-100">"{{ tipoData.nombre_tipo }}"</span>?
                </p>
                
                <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div class="text-sm">
                      <p class="text-red-800 dark:text-red-300 font-medium mb-1">Importante:</p>
                      <p class="text-red-700 dark:text-red-400">
                        Si existen registradores asociados a este tipo, la eliminación será rechazada.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Información del tipo -->
                <div class="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-4 border border-slate-200 dark:border-gray-600">
                  <div class="grid grid-cols-1 gap-3 text-sm">
                    <div class="flex justify-between">
                      <span class="text-slate-600 dark:text-gray-400">ID:</span>
                      <span class="font-mono text-slate-900 dark:text-gray-100">#{{ tipoData.id }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-600 dark:text-gray-400">Estado:</span>
                      <span [class]="tipoData.activo 
                        ? 'px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded text-xs font-medium'
                        : 'px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 rounded text-xs font-medium'">
                        {{ tipoData.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </div>
                    @if (tipoData.descripcion) {
                      <div class="pt-2 border-t border-slate-200 dark:border-gray-600">
                        <span class="text-slate-600 dark:text-gray-400 block mb-1">Descripción:</span>
                        <p class="text-slate-900 dark:text-gray-100 text-xs bg-white dark:bg-gray-800 p-2 rounded border">
                          {{ tipoData.descripcion }}
                        </p>
                      </div>
                    }
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="bg-slate-50 dark:bg-gray-800/50 px-6 py-4 flex gap-3 justify-end border-t border-slate-200 dark:border-gray-700">
            <button 
              (click)="onClose.emit()"
              class="px-4 py-2.5 bg-slate-200 dark:bg-gray-600 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-300 dark:hover:bg-gray-500 transition-colors font-medium">
              Cancelar
            </button>
            <button 
              (click)="confirmDelete()"
              class="px-4 py-2.5 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-medium inline-flex items-center gap-2 shadow-sm">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar Tipo
            </button>
          </div>
        </div>
      </div>
    }
  `,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ transform: 'scale(0.9)', opacity: 0 }))
      ])
    ])
  ]
})
export class ConfirmDeleteTipoModalComponent {
  @Input() isVisible = false;
  @Input() tipoData: TipoRegistrador | null = null;
  
  @Output() onClose = new EventEmitter<void>();
  @Output() onConfirmed = new EventEmitter<TipoRegistrador>();

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose.emit();
    }
  }

  confirmDelete(): void {
    if (this.tipoData) {
      this.onConfirmed.emit(this.tipoData);
    }
  }
}