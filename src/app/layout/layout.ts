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
import PAGES_ROUTES from '../core/routes/pages.routes';
@Component({
  selector: 'app-layout',
  imports: [
    RouterModule,
    CommonModule,
    ButtonModule,
    MenuModule,
    AvatarModule,
    BadgeModule,
    RippleModule,
    CardModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  sidebarVisible = signal<boolean>(true);
  isMobile = signal<boolean>(false);
  notificationsCount = signal<number>(3);
  protected readonly configService = inject(AppConfigService);
  private readonly router = inject(Router);

  isDarkMode = computed(() => this.configService.appState().darkTheme);

  // Menú de opciones para móvil
  mobileMenuItems = computed(() => [
    {
      label: `Notificaciones ${
        this.notificationsCount() > 0 ? `(${this.notificationsCount()})` : ''
      }`,
      icon: 'pi pi-bell',
      command: () => this.openNotifications(),
      styleClass: this.notificationsCount() > 0 ? 'mobile-menu-notifications' : '',
    },
    {
      separator: true,
    },
    {
      label: this.isDarkMode() ? 'Modo Claro' : 'Modo Oscuro',
      icon: this.isDarkMode() ? 'pi pi-sun' : 'pi pi-moon',
      command: () => this.toggleDarkMode(),
    },
    {
      separator: true,
    },
    {
      label: 'Perfil de Usuario',
      icon: 'pi pi-user',
      command: () => this.openUserProfile(),
    },
  ]);

  ngOnInit() {
    this.checkScreenSize();

    // Cerrar sidebar en móvil cuando se navega a una nueva ruta
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
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
    const menuButtons = document.querySelectorAll('[data-menu-button]');

    // Si estamos en mobile y el sidebar está visible
    if (this.isMobile() && this.sidebarVisible()) {
      // Verificar si el clic fue en algún botón de menú
      let clickedMenuButton = false;
      menuButtons.forEach((button) => {
        if (button.contains(target)) {
          clickedMenuButton = true;
        }
      });

      // Si el clic no fue en el sidebar ni en ningún botón de menú
      if (sidebar && !sidebar.contains(target) && !clickedMenuButton) {
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
      route: PAGES_ROUTES.DASHBOARD.DASHBOARD,
    },
    {
      label: 'Tablas',
      icon: 'pi pi-play',
      items: [
        { label: 'Buscar', icon: 'pi pi-circle-fill', route:  `${PAGES_ROUTES.DASHBOARD.TABLAS.DEFAULT}/${PAGES_ROUTES.DASHBOARD.TABLAS.BUSCAR_TABLA}`},
        { label: 'Historial', icon: 'pi pi-history', route: '/dashboard/games/history' },
      ],
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      route: '/dashboard/users',
    },
    {
      label: 'Reportes',
      icon: 'pi pi-chart-line',
      items: [
        { label: 'Ventas', icon: 'pi pi-dollar', route: '/dashboard/reports/sales' },
        { label: 'Jugadores', icon: 'pi pi-user', route: '/dashboard/reports/players' },
      ],
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      route: '/dashboard/settings',
    },
  ];

  // Controla qué items del menú están expandidos (por label)
  expanded = signal<string[]>([]);

  isExpanded(label: string) {
    return this.expanded().includes(label);
  }

  toggleMenuItem(label: string, event?: Event) {
    // Evitar que un <a> con routerLink navegue si venimos del clic que quiere alternar el submenu
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.expanded.update((items) => {
      const exists = items.includes(label);
      if (exists) {
        return items.filter((l) => l !== label);
      }
      return [...items, label];
    });
  }

  // Datos de ejemplo para las estadísticas
  stats = [
    { title: 'Juegos Activos', value: '12', icon: 'pi pi-play', color: 'text-green-500' },
    { title: 'Jugadores Conectados', value: '248', icon: 'pi pi-users', color: 'text-blue-500' },
    { title: 'Ventas Hoy', value: '$1,234', icon: 'pi pi-dollar', color: 'text-purple-500' },
    { title: 'Total Cartones', value: '1,856', icon: 'pi pi-grid', color: 'text-orange-500' },
  ];

  toggleSidebar() {
    this.sidebarVisible.update((visible) => {
      const newVisible = !visible;
      if (!newVisible) {
        // Al ocultar la sidebar, colapsar todos los submenus
        this.expanded.set([]);
      }
      return newVisible;
    });
  }

  toggleDarkMode() {
    this.configService.appState.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  openNotifications() {
    console.log('Abrir notificaciones');
    // Simular que se leyeron las notificaciones
    this.notificationsCount.set(0);
    // Aquí puedes implementar la lógica para abrir las notificaciones
  }

  openUserProfile() {
    console.log('Abrir perfil de usuario');
    // Aquí puedes implementar la lógica para abrir el perfil
    this.router.navigate(['/dashboard/profile']);
  }
}
