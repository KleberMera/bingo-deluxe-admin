import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    AvatarModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export default class Home {
  // Datos de ejemplo para las estadísticas
  stats = [
    { title: 'Juegos Activos', value: '12', icon: 'pi pi-play', color: 'text-green-500' },
    { title: 'Jugadores Conectados', value: '248', icon: 'pi pi-users', color: 'text-blue-500' },
    { title: 'Ventas Hoy', value: '$1,234', icon: 'pi pi-dollar', color: 'text-purple-500' },
    { title: 'Total Cartones', value: '1,856', icon: 'pi pi-grid', color: 'text-orange-500' }
  ];
}
