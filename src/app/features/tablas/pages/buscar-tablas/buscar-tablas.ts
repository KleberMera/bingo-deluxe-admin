import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuscarTablasService, UsuarioCheckResponse } from '../../services/buscar-tablas.service';

@Component({
  selector: 'app-buscar-tablas',
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-tablas.html',
  styleUrl: './buscar-tablas.css'
})
export default class BuscarTablas {
  private buscarTablasService = inject(BuscarTablasService);

  cedula = '';
  loading = signal(false);
  error = signal<string | null>(null);
  usuario = signal<UsuarioCheckResponse['data'] | null>(null);
  existe = signal<boolean>(false);
  mensaje = signal<string | null>(null);
  brigadaActual = signal<boolean>(false);
  cantidadTablasEdit = signal<number | null>(null);

  buscar() {
    this.error.set(null);
    this.usuario.set(null);
    this.existe.set(false);
    this.mensaje.set(null);
    this.brigadaActual.set(false);
    this.cantidadTablasEdit.set(null);
    if (!this.cedula || this.cedula.length < 6) {
      this.error.set('Ingrese una cédula válida');
      return;
    }
    this.loading.set(true);
    this.buscarTablasService.buscarPorCedula(this.cedula).subscribe({
      next: (resp) => {
        this.loading.set(false);
        this.mensaje.set(resp.message);
        if (resp && resp.data) {
          this.usuario.set(resp.data);
          this.existe.set(resp.exists);
          // Solo se puede editar si existe y la brigada del usuario es igual a la brigada actual
          if (resp.exists && resp.data.id_evento === resp.brigadaInfo.id_evento) {
            this.brigadaActual.set(true);
            this.cantidadTablasEdit.set(resp.data.cantidad_tablas);
          } else {
            this.brigadaActual.set(false);
          }
        } else {
          this.usuario.set(null);
          this.existe.set(false);
          this.brigadaActual.set(false);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Error al buscar usuario');
      }
    });
  }

  actualizarCantidadTablas() {
    this.error.set(null);
    const cantidad = this.cantidadTablasEdit();
    if (!this.usuario() || cantidad == null || cantidad < 1) {
      this.error.set('La cantidad de tablas debe ser al menos 1');
      return;
    }
    this.loading.set(true);
    this.buscarTablasService.actualizarCantidadTablas(this.usuario()!.id_card, this.cantidadTablasEdit()!).subscribe({
      next: (resp) => {
        this.loading.set(false);
        if (resp.success) {
          this.mensaje.set('Cantidad de tablas actualizada');
          // Actualizar usuario local
          if (this.usuario()) {
            this.usuario.set({ ...this.usuario()!, cantidad_tablas: this.cantidadTablasEdit()! });
          }
        } else {
          this.error.set(resp.message || 'No se pudo actualizar');
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Error al actualizar cantidad de tablas');
      }
    });
  }
}
