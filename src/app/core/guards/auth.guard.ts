import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectAccessToken,
  selectIsLoading,
} from '../../features/auth/store/auth.reducer';
import { filter, map, switchMap, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  // Wait for the initial loading process to finish
  return store.select(selectIsLoading).pipe(
    // Wait until loading is finished
    filter((isLoading) => !isLoading),
    // Take the firat value that matches
    take(1),
    // Check the access token
    switchMap(() => store.select(selectAccessToken)),
    map((token) => {
      if (token) {
        // if token exists after loading, allow navigation
        return true;
      }

      // If no token, redirect to the login page and block navigation
      router.navigate(['/login']);
      return false;
    })
  );
};
