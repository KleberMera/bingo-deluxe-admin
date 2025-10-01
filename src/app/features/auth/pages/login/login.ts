import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from "primeng/floatlabel"
import { RippleModule } from 'primeng/ripple';
@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    FloatLabelModule,
    RippleModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export default class Login {
checked1 = signal<boolean>(true);
value = signal<string>('');
}
