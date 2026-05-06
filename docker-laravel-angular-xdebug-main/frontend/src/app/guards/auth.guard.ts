import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const user = localStorage.getItem('token');

  if (user) {
    return true;
  }

  return router.createUrlTree(['/login']);
};