import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['expectedRoles'] as string[];

  const userRoles = authService.getUserRoles();

  const hasRequiredRole = userRoles.some(role => expectedRoles.includes(role));

  if (hasRequiredRole) {
    return true;
  }

  alert("Accès refusé : vous n'avez pas les droits nécessaires (Rôle " + expectedRoles.join(', ') + " requis).");
  return router.createUrlTree(['/books']);
};
