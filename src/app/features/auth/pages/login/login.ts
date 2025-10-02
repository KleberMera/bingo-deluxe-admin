import { Component, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

import { CommonModule } from '@angular/common';
import { AppConfigService } from '../../../../shared/services/appconfigservice';

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
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export default class Login {
  checked1 = signal<boolean>(true);
  value = signal<string>('');

  protected readonly configService = inject(AppConfigService);

  toggleDarkMode() {
    this.configService.appState.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  isDarkMode = computed(() => this.configService.appState().darkTheme);
}
