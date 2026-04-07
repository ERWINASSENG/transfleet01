import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { WebSocketService } from '../../../core/services/websocket.service';

interface NavItem { label: string; route: string; managerOnly?: boolean }

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  api  = inject(ApiService);
  ws   = inject(WebSocketService);

  sidebarOpen  = signal(true);
  userMenuOpen = signal(false);
  unreadCount  = signal(0);

  user      = this.auth.currentUser;
  isManager = this.auth.isManager;

  initials = computed(() => {
    const u = this.user();
    return u ? (u.firstName[0] + u.lastName[0]).toUpperCase() : '??';
  });

  navItems: NavItem[] = [
    { label: 'Tableau de bord', route: '/dashboard', managerOnly: true },
    { label: 'Véhicules',       route: '/vehicles',      managerOnly: true },
    { label: 'Conducteurs',     route: '/drivers',       managerOnly: true },
    { label: 'Trajets',         route: '/trips' },
    { label: 'Carburant',       route: '/fuel',          managerOnly: true },
    { label: 'Maintenance',     route: '/maintenance',   managerOnly: true },
    { label: 'Suivi GPS',       route: '/tracking',      managerOnly: true },
    // La ligne des rapports a été mise en commentaire juste en dessous :
    // { label: 'Rapports',        route: '/reports',       managerOnly: true },
  ];

  visibleItems = computed(() =>
    this.navItems.filter(i => !i.managerOnly || this.isManager())
  );

  ngOnInit(): void {
    this.refreshUnread();
    setInterval(() => this.refreshUnread(), 60_000);
    
    // Connexion WebSocket pour notifications en temps réel
    if (this.auth.isLoggedIn()) {
      this.ws.connect();
      this.ws.on('new_notification', () => {
        this.refreshUnread();
      });
    }
  }

  ngOnDestroy(): void {
    this.ws.disconnect();
  }

  private refreshUnread(): void {
    this.api.getUnreadCount().subscribe({
      next: (r) => this.unreadCount.set(r.unread_count ?? 0),
      error: () => {},
    });
  }

  toggleSidebar(): void  { this.sidebarOpen.update(v => !v); }
  toggleUserMenu(): void { this.userMenuOpen.update(v => !v); }
  closeUserMenu(): void  { this.userMenuOpen.set(false); }
  logout(): void         { this.auth.logout(); }
}