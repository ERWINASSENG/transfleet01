import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const requiredRoles = route.data['roles'] as string[];

    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          return this.router.createUrlTree(['/login']);
        }

        if (!requiredRoles || requiredRoles.length === 0) {
          return true;
        }

        const hasRequiredRole = requiredRoles.some(role => {
          if (role === 'manager') {
            return this.authService.isManager();
          }
          if (role === 'driver') {
            return this.authService.isDriver();
          }
          return user.role === role;
        });

        if (hasRequiredRole) {
          return true;
        }

        return this.router.createUrlTree(['/dashboard']);
      })
    );
  }
}
