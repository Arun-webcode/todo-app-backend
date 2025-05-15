import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const loginGuard: CanActivateFn = async (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  if (await storageService.isLoggedIn() == null) {
    return true;
  } else {
    router.navigate(['home']);
    return false;
  }
};
