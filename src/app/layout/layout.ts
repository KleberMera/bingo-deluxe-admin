import { Component, computed, inject, signal, HostListener, OnInit } from '@angular/core';
import { AppConfigService } from '../shared/services/appconfigservice';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-layout',
  imports: [RouterModule, CommonModule,ButtonModule, MenuModule, AvatarModule, BadgeModule, RippleModule, CardModule ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout implements OnInit {
  sidebarVisible = signal<boolean>(true);
  isMobile = signal<boolean>(false);
  protected readonly configService = inject(AppConfigService);
  private readonly router = inject(Router);

  ngOnInit() {
    this.checkScreenSize();
    
    // Cerrar sidebar en móvil cuando se navega a una nueva ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile()) {
          this.sidebarVisible.set(false);
        }
      });
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const sidebar = document.querySelector('.sidebar-transition');
    const menuButton = document.querySelector('[data-menu-button]');
    
    // Si estamos en mobile y el sidebar está visible
    if (this.isMobile() && this.sidebarVisible()) {
      // Si el clic no fue en el sidebar ni en el botón de menú
      if (sidebar && !sidebar.contains(target) && menuButton && !menuButton.contains(target)) {
        this.sidebarVisible.set(false);
      }
    }
  }

  private checkScreenSize() {
    const isMobileSize = window.innerWidth <= 768;
    this.isMobile.set(isMobileSize);
    
    // Si cambiamos a móvil, ocultar sidebar por defecto
    if (isMobileSize) {
      this.sidebarVisible.set(false);
    } else {
      // Si cambiamos a desktop, mostrar sidebar por defecto
      this.sidebarVisible.set(true);
    }
  }

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
