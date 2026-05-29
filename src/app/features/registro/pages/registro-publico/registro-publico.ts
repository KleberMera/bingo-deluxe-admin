import { Component, inject, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { toast } from 'ngx-sonner';
import { finalize } from 'rxjs';
import { AppConfigService } from '../../../../shared/services/appconfigservice';
import { srvAsistencia } from '../../services/asistencia.service';
import { HttpErrorResponse } from '@angular/common/http';

const CELULAR_PATTERN = /^\d{10}$/;

@Component({
  selector: 'app-registro-publico',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './registro-publico.html',
})
export default class RegistroPublico {
  private readonly fb = inject(FormBuilder);
  private readonly asistenciaService = inject(srvAsistencia);
  protected readonly configService = inject(AppConfigService);

  readonly enviando = signal(false);

  readonly form = this.fb.nonNullable.group({
    nombres: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    cedula: ['', [Validators.required]],
    celular: ['', [Validators.required, Validators.pattern(CELULAR_PATTERN)]],
  });

  isDarkMode = computed(() => this.configService.appState().darkTheme);

  toggleDarkMode() {
    this.configService.appState.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nombres, apellidos, cedula, celular } = this.form.getRawValue();
    this.enviando.set(true);

    this.asistenciaService
      .registrar({ nombres, apellidos, cedula, celular })
      .pipe(finalize(() => this.enviando.set(false)))
      .subscribe({
        next: (response) => {
          if (response.error) {
            toast.error(response.message || 'No se pudo registrar la asistencia.');
            return;
          }
          toast.success(response.message || 'Registro enviado correctamente.');
          this.form.reset();
        },
        error: (error: HttpErrorResponse) => {
          toast.error(error.error.message || 'Ocurrió un error al enviar el registro. Intenta de nuevo.');
        },
      });
  }
}
