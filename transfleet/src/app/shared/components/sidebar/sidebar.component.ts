import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styles: [`
    .sidebar {
      width: 260px;
      background: #fff;
      border-right: 1px solid #e0e0e0;
      height: calc(100vh - 60px);
      overflow-y: auto;
      transition: width 0.3s;
    }

    .sidebar.collapsed {
      width: 60px;
    }

    .sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .sidebar-nav {
      padding: 0.5rem 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      color: #555;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      border-radius: 0 24px 24px 0;
      margin: 2px 8px;
    }

    .nav-item:hover {
      background: #f5f5f5;
      color: #1a237e;
    }

    .nav-item.active {
      background: #e8eaf6;
      color: #1a237e;
    }

    .nav-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
      font-size: 1.1rem;
    }

    .nav-label {
      font-size: 0.9rem;
      white-space: nowrap;
    }

    .sidebar.collapsed .nav-label {
      display: none;
    }

    .sidebar.collapsed .nav-item {
      justify-content: center;
      padding: 0.75rem;
      margin: 2px;
      border-radius: 8px;
    }

    .sidebar.collapsed .nav-icon {
      margin-right: 0;
    }

    .sidebar-section {
      margin-top: 1rem;
      padding-top: 0.5rem;
      border-top: 1px solid #e0e0e0;
    }

    .section-title {
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #999;
      font-weight: 600;
    }

    .sidebar.collapsed .section-title {
      display: none;
    }

    .toggle-btn {
      position: absolute;
      right: -12px;
      top: 20px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #1a237e;
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      z-index: 10;
    }
  `]
})
export class SidebarComponent {
  private authService = inject(AuthService);

  collapsed = input(false);
  collapsedChange = output<boolean>();

  isManager = () => this.authService.isManager();
  isDriver = () => this.authService.isDriver();

  mainMenuItems: MenuItem[] = [
    { icon: '📊', label: 'Tableau de bord', route: '/dashboard' },
    { icon: '🚗', label: 'Véhicules', route: '/vehicles' },
    { icon: '👤', label: 'Conducteurs', route: '/drivers' },
    { icon: '🗺️', label: 'Trajets', route: '/trips' },
  ];

  managementMenuItems: MenuItem[] = [
    { icon: '⛽', label: 'Carburant', route: '/fuel', roles: ['manager', 'admin'] },
    { icon: '🔧', label: 'Maintenance', route: '/maintenance', roles: ['manager', 'admin'] },
    { icon: '📍', label: 'Suivi GPS', route: '/tracking', roles: ['manager', 'admin'] },
    { icon: '📈', label: 'Rapports', route: '/reports', roles: ['manager', 'admin'] },
  ];

  toggle(): void {
    this.collapsedChange.emit(!this.collapsed());
  }

  canShowItem(item: MenuItem): boolean {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    return item.roles.some(role => {
      if (role === 'manager') return this.isManager();
      if (role === 'driver') return this.isDriver();
      return false;
    });
  }
}
