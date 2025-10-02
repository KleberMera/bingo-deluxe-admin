import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { AppConfigService } from '../../../../shared/services/appconfigservice';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    MenuModule,
    AvatarModule,
    BadgeModule,
    RippleModule,
    CardModule,
  
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  sidebarVisible = signal<boolean>(true);
  protected readonly configService = inject(AppConfigService);

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/dashboard'
    },
    {
      label: 'Juegos',
      icon: 'pi pi-play',
      items: [
        { label: 'Activos', icon: 'pi pi-circle-fill', route: '/dashboard/games/active' },
        { label: 'Historial', icon: 'pi pi-history', route: '/dashboard/games/history' }
      ]
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      route: '/dashboard/users'
    },
    {
      label: 'Reportes',
      icon: 'pi pi-chart-line',
      items: [
        { label: 'Ventas', icon: 'pi pi-dollar', route: '/dashboard/reports/sales' },
        { label: 'Jugadores', icon: 'pi pi-user', route: '/dashboard/reports/players' }
      ]
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      route: '/dashboard/settings'
    }
  ];

  // Datos de ejemplo para las estadísticas
  stats = [
    { title: 'Juegos Activos', value: '12', icon: 'pi pi-play', color: 'text-green-500' },
    { title: 'Jugadores Conectados', value: '248', icon: 'pi pi-users', color: 'text-blue-500' },
    { title: 'Ventas Hoy', value: '$1,234', icon: 'pi pi-dollar', color: 'text-purple-500' },
    { title: 'Total Cartones', value: '1,856', icon: 'pi pi-grid', color: 'text-orange-500' }
  ];

  isDarkMode = computed(() => this.configService.appState().darkTheme);

  toggleSidebar() {
    this.sidebarVisible.update(visible => !visible);
  }

  toggleDarkMode() {
    this.configService.appState.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }
}
