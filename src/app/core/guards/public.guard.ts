import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAccessToken } from '../../features/auth/store/auth.reducer';
import { map, take } from 'rxjs';

export const publicGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  // Checks for the presence of a token.
  return store.select(selectAccessToken).pipe(
    take(1), // Only need to check the current state once.
    map((token) => {
      if (token) {
        // If a token EXISTS, the user is logged in.
        // Block access to the public page and redirect to the dashboard.
        router.navigate(['/dashboard']);
        return false;
      }

      // If there is NO token, the user is not logged in.
      // Allow access to the public page (e.g., /login).
      return true;
    })
  );
};
