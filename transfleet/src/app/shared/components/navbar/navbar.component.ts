import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styles: [`
    .navbar {
      background: #1a237e;
      color: white;
      padding: 0 1rem;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .navbar-brand {
      font-size: 1.5rem;
      font-weight: bold;
      text-decoration: none;
      color: white;
    }

    .navbar-nav {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .nav-link {
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .nav-link:hover,
    .nav-link.active {
      color: white;
      background: rgba(255,255,255,0.1);
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .user-menu:hover {
      background: rgba(255,255,255,0.1);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #3949ab;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .dropdown {
      position: relative;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      min-width: 180px;
      z-index: 1000;
      display: none;
    }

    .dropdown.open .dropdown-menu {
      display: block;
    }

    .dropdown-item {
      display: block;
      padding: 0.75rem 1rem;
      color: #333;
      text-decoration: none;
      cursor: pointer;
    }

    .dropdown-item:hover {
      background: #f5f5f5;
    }

    .dropdown-divider {
      border-top: 1px solid #eee;
      margin: 0.5rem 0;
    }
  `]
})
export class NavbarComponent {
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;

  isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.isDropdownOpen = false;
  }

  getUserInitials(): string {
    const user = this.currentUser() as User | null;
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
}
