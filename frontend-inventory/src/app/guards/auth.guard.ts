import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const authGuard: CanActivateFn = (route, state) => {
  const msalService = inject(MsalService);
  const router = inject(Router);

  const activeAccount = msalService.instance.getActiveAccount();
  const accounts = msalService.instance.getAllAccounts();

  if (activeAccount || accounts.length > 0) {
    return true;
  }

  router.navigate(['/']);
  return false;
};