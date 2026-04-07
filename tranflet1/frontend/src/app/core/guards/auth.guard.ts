import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);
  
  // Si le mot de passe est par défaut, rediriger vers la page de changement
  if (auth.passwordIsDefault()) {
    return router.createUrlTree(['/force-password-change']);
  }
  
  return true;
};

export const guestGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) return true;
  // Redirection selon le rôle
  if (auth.isDriver()) return router.createUrlTree(['/trips']);
  return router.createUrlTree(['/dashboard']);
};

export const driverRedirectGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  // Les drivers n'ont pas accès au dashboard, redirigés vers trips
  if (auth.isDriver()) return router.createUrlTree(['/trips']);
  return true;
};

export const forcePasswordChangeGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  // Seuls les utilisateurs connectés peuvent accéder à cette page
  if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);
  // Ne pas rediriger si déjà sur force-password-change
  return true;
};

export const managerGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (auth.isManager()) return true;
  return router.createUrlTree(['/dashboard']);
};
