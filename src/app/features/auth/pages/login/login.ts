import { Component, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { AppConfigService } from '../../../../shared/services/appconfigservice';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import PAGES_ROUTES from '../../../../core/routes/pages.routes';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    FloatLabelModule,
    RippleModule,
    TooltipModule,
    CommonModule,
    DialogModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  providers: [DialogService],
})
export default class Login {
  checked1 = signal<boolean>(true);
  value = signal<string>('');
  showLoginDialog = signal<boolean>(false);

  protected readonly configService = inject(AppConfigService);
  private readonly router = inject(Router);

  toggleDarkMode() {
    this.configService.appState.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  isDarkMode = computed(() => this.configService.appState().darkTheme);

  onLogin() {
    this.showLoginDialog.set(true);
    
    // Simular proceso de login
    setTimeout(() => {
      this.showLoginDialog.set(false);
      // Redirigir al dashboard después del login exitoso
      this.router.navigate([PAGES_ROUTES.DASHBOARD.DASHBOARD]);
    }, 2000);
  }
}
