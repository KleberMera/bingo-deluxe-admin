import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { srvTiposRegistradores } from '../services/tipos-registradores';
import { TipoRegistrador } from '../interfaces/tipo-registrador.interface';

@Component({
  selector: 'app-tipo-registrador-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <!-- Modal Backdrop -->
    @if (isVisible()) {
      <div 
        class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        (click)="onBackdropClick($event)">
        <div 
          class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all"
          (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {{ isEditMode() ? 'Editar Tipo de Registrador' : 'Nuevo Tipo de Registrador' }}
              </h3>
              <button 
                type="button"
                (click)="cerrarModal()"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Form -->
          <form [formGroup]="tipoForm" (ngSubmit)="onSubmit()">
            <div class="px-6 py-4 space-y-4">
              
              <!-- Nombre del Tipo -->
              <div>
                <label for="nombre_tipo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del Tipo *
                </label>
                <input
                  type="text"
                  id="nombre_tipo"
                  formControlName="nombre_tipo"
                  placeholder="Ej: Supervisor, Coordinador, etc."
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                         placeholder-gray-500 dark:placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                         transition-colors"
                  [class.border-red-500]="tipoForm.get('nombre_tipo')?.invalid && tipoForm.get('nombre_tipo')?.touched">
                
                @if (tipoForm.get('nombre_tipo')?.invalid && tipoForm.get('nombre_tipo')?.touched) {
                  <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                    El nombre del tipo es requerido (mínimo 2 caracteres)
                  </p>
                }
              </div>

              <!-- Descripción -->
              <div>
                <label for="descripcion" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  id="descripcion"
                  formControlName="descripcion"
                  rows="3"
                  placeholder="Describe las responsabilidades o características de este tipo de registrador..."
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                         placeholder-gray-500 dark:placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                         transition-colors resize-none">
                </textarea>
              </div>

              <!-- Estado Activo -->
              <div>
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="activo"
                    formControlName="activo"
                    class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                           rounded focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2">
                  <label for="activo" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipo activo
                  </label>
                </div>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Los tipos inactivos no aparecerán en el formulario de registradores
                </p>
              </div>

              <!-- Preview del tipo -->
              @if (tipoForm.get('nombre_tipo')?.value) {
                <div class="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Vista previa: {{ tipoForm.get('nombre_tipo')?.value }}
                      </p>
                      @if (tipoForm.get('descripcion')?.value) {
                        <p class="text-sm text-blue-700 dark:text-blue-400 mt-1">
                          {{ tipoForm.get('descripcion')?.value }}
                        </p>
                      }
                      <div class="flex items-center gap-2 mt-2">
                        <span [class]="tipoForm.get('activo')?.value 
                          ? 'w-2 h-2 rounded-full bg-green-500 dark:bg-green-400' 
                          : 'w-2 h-2 rounded-full bg-red-500 dark:bg-red-400'">
                        </span>
                        <span class="text-xs font-medium" [class]="tipoForm.get('activo')?.value 
                          ? 'text-green-800 dark:text-green-300' 
                          : 'text-red-800 dark:text-red-300'">
                          {{ tipoForm.get('activo')?.value ? 'Activo' : 'Inactivo' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                type="button"
                (click)="cerrarModal()"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 
                       hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="tipoForm.invalid || guardando()"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                       text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
                       inline-flex items-center gap-2">
                @if (guardando()) {
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                }
                {{ isEditMode() ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class TipoRegistradorFormModalComponent {
  private fb = inject(FormBuilder);
  private srvTiposRegistradores = inject(srvTiposRegistradores);

  // Inputs
  isVisible = input<boolean>(false);
  tipoData = input<TipoRegistrador | null>(null);

  // Outputs
  onClose = output<void>();
  onSave = output<TipoRegistrador>();

  // Signals
  guardando = signal(false);

  // Computed
  isEditMode = computed(() => !!this.tipoData());

  // Form
  tipoForm: FormGroup;

  constructor() {
    this.tipoForm = this.fb.group({
      nombre_tipo: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: [''],
      activo: [true]
    });

    // Effect para configurar formulario cuando se abre el modal
    effect(() => {
      if (this.isVisible()) {
        this.configurarFormulario();
      }
    });
  }

  private configurarFormulario(): void {
    const data = this.tipoData();
    if (data) {
      // Modo edición
      this.tipoForm.patchValue({
        nombre_tipo: data.nombre_tipo,
        descripcion: data.descripcion || '',
        activo: data.activo
      });
    } else {
      // Modo creación
      this.tipoForm.reset({
        nombre_tipo: '',
        descripcion: '',
        activo: true
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.tipoForm.invalid) {
      this.tipoForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);

    try {
      const formValue = this.tipoForm.value;
      const data = {
        nombre_tipo: formValue.nombre_tipo,
        descripcion: formValue.descripcion || undefined,
        activo: formValue.activo
      };

      let response;
      if (this.isEditMode()) {
        const tipo = this.tipoData()!;
        response = await firstValueFrom(
          this.srvTiposRegistradores.actualizarTipo(tipo.id, data)
        );
      } else {
        response = await firstValueFrom(
          this.srvTiposRegistradores.crearTipo(data)
        );
      }

      if (response.data) {
        this.onSave.emit(response.data);
        this.cerrarModal();
      }
    } catch (error) {
      console.error('Error al guardar tipo de registrador:', error);
      // Aquí podrías mostrar un toast o mensaje de error
    } finally {
      this.guardando.set(false);
    }
  }

  cerrarModal(): void {
    this.tipoForm.reset();
    this.onClose.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    // Solo cerrar si el clic fue directamente en el backdrop, no en sus hijos
    if (event.target === event.currentTarget) {
      this.cerrarModal();
    }
  }
}