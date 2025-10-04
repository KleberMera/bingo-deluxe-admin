import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { srvRegistradores } from '../services/registradores';
import { TipoRegistrador, Registrador } from '../../../core/interfaces/registrador';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-registrador-form-modal',
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
                {{ isEditMode() ? 'Editar Registrador' : 'Nuevo Registrador' }}
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
          <form [formGroup]="registradorForm" (ngSubmit)="onSubmit()">
            <div class="px-6 py-4 space-y-4">
              
              <!-- Nombre del Registrador -->
              <div>
                <label for="nombre_registrador" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del Registrador *
                </label>
                <input
                  type="text"
                  id="nombre_registrador"
                  formControlName="nombre_registrador"
                  placeholder="Ingrese el nombre del registrador"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                         placeholder-gray-500 dark:placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                         transition-colors"
                  [class.border-red-500]="registradorForm.get('nombre_registrador')?.invalid && registradorForm.get('nombre_registrador')?.touched">
                
                @if (registradorForm.get('nombre_registrador')?.invalid && registradorForm.get('nombre_registrador')?.touched) {
                  <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                    El nombre del registrador es requerido
                  </p>
                }
              </div>

              <!-- Tipo de Registrador -->
              <div>
                <label for="id_tipo_registrador" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Registrador (opcional)
                </label>
                
                @if (loadingTipos()) {
                  <div class="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">Cargando tipos...</span>
                  </div>
                } @else {
                  <select
                    id="id_tipo_registrador"
                    formControlName="id_tipo_registrador"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                           transition-colors">
                    <option value="">Sin tipo asignado</option>
                    @for (tipo of tiposDisponibles(); track tipo.id) {
                      <option [value]="tipo.id">
                        {{ tipo.nombre_tipo }}
                       
                      </option>
                    }
                  </select>
                }
                
                @if (errorTipos()) {
                  <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                    Error al cargar tipos de registradores
                  </p>
                }
              </div>

              <!-- Información del tipo seleccionado -->
              @if (tipoSeleccionado(); as tipo) {
                <div class="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-blue-800 dark:text-blue-300">
                        {{ tipo.nombre_tipo }}
                      </p>
                      @if (tipo.descripcion) {
                        <p class="text-sm text-blue-700 dark:text-blue-400 mt-1">
                          {{ tipo.descripcion }}
                        </p>
                      }
                      <div class="flex items-center gap-2 mt-2">
                        <span [class]="tipo.activo 
                          ? 'w-2 h-2 rounded-full bg-green-500 dark:bg-green-400' 
                          : 'w-2 h-2 rounded-full bg-red-500 dark:bg-red-400'">
                        </span>
                        <span class="text-xs font-medium" [class]="tipo.activo 
                          ? 'text-green-800 dark:text-green-300' 
                          : 'text-red-800 dark:text-red-300'">
                          {{ tipo.activo ? 'Activo' : 'Inactivo' }}
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
                [disabled]="registradorForm.invalid || guardando()"
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
export class RegistradorFormModalComponent {
  private fb = inject(FormBuilder);
  private srvRegistradores = inject(srvRegistradores);

  // Inputs
  isVisible = input<boolean>(false);
  registradorData = input<Registrador | null>(null);

  // Outputs
  onClose = output<void>();
  onSave = output<Registrador>();

  // Signals
  guardando = signal(false);
  loadingTipos = signal(false);
  errorTipos = signal(false);
  tiposRegistradores = signal<TipoRegistrador[]>([]);

  // Computed
  isEditMode = computed(() => !!this.registradorData());
  tiposDisponibles = computed(() => this.tiposRegistradores());
  tipoSeleccionado = computed(() => {
    const tipoId = this.registradorForm.get('id_tipo_registrador')?.value;
    if (!tipoId) return null;
    return this.tiposDisponibles().find(t => t.id === Number(tipoId)) || null;
  });

  // Form
  registradorForm: FormGroup;

  constructor() {
    this.registradorForm = this.fb.group({
      nombre_registrador: ['', [Validators.required, Validators.minLength(2)]],
      id_tipo_registrador: ['']
    });

    // Effect para cargar tipos cuando el modal se abre
    effect(() => {
      if (this.isVisible()) {
        this.cargarTipos();
        this.configurarFormulario();
      }
    });
  }

  private async cargarTipos(): Promise<void> {
    this.loadingTipos.set(true);
    this.errorTipos.set(false);
    
    try {
      const response = await firstValueFrom(this.srvRegistradores.listarTiposRegistradores());
      this.tiposRegistradores.set(response.data || []);
    } catch (error) {
      console.error('Error al cargar tipos:', error);
      this.errorTipos.set(true);
      this.tiposRegistradores.set([]);
    } finally {
      this.loadingTipos.set(false);
    }
  }

  private configurarFormulario(): void {
    const data = this.registradorData();
    if (data) {
      // Modo edición
      this.registradorForm.patchValue({
        nombre_registrador: data.nombre_registrador,
        id_tipo_registrador: data.id_tipo_registrador || ''
      });
    } else {
      // Modo creación
      this.registradorForm.reset();
    }
  }

  async onSubmit(): Promise<void> {
    if (this.registradorForm.invalid) {
      this.registradorForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);

    try {
      const formValue = this.registradorForm.value;
      const data = {
        nombre_registrador: formValue.nombre_registrador,
        id_tipo_registrador: formValue.id_tipo_registrador || undefined
      };

      let response;
      if (this.isEditMode()) {
        const registrador = this.registradorData()!;
        response = await firstValueFrom(
          this.srvRegistradores.actualizarRegistrador(registrador.id, data)
        );
      } else {
        response = await firstValueFrom(
          this.srvRegistradores.crearRegistrador(data)
        );
      }

      if (response.data) {
        this.onSave.emit(response.data);
        toast.success(response.message || (this.isEditMode() ? 'Registrador actualizado exitosamente.' : 'Registrador creado exitosamente.'));
        this.cerrarModal();
      }
    } catch (error) {
      console.error('Error al guardar registrador:', error);
      // Aquí podrías mostrar un toast o mensaje de error
    } finally {
      this.guardando.set(false);
    }
  }

  cerrarModal(): void {
    this.registradorForm.reset();
    this.onClose.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    // Solo cerrar si el clic fue directamente en el backdrop, no en sus hijos
    if (event.target === event.currentTarget) {
      this.cerrarModal();
    }
  }
}