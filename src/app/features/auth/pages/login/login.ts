import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from "primeng/floatlabel"
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { ThemeService } from '../../../../core/services/theme.service';
@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    FloatLabelModule,
    RippleModule,
    TooltipModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export default class Login {
  themeService = inject(ThemeService);
  checked1 = signal<boolean>(true);
  value = signal<string>('');

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
