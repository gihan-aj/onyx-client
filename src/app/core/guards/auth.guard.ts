import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectAccessToken,
  selectAuthState,
  selectIsLoading,
} from '../../features/auth/store/auth.reducer';
import { filter, map, switchMap, take } from 'rxjs';
import { AuthActions } from '../../features/auth/store/auth.actions';

// export const authGuard: CanActivateFn = (route, state) => {
//   const store = inject(Store);
//   const router = inject(Router);

//   // Wait for the initial loading process to finish
//   return store.select(selectIsLoading).pipe(
//     // Wait until loading is finished
//     filter((isLoading) => !isLoading),
//     // Take the firat value that matches
//     take(1),
//     // Check the access token
//     switchMap(() => store.select(selectAccessToken)),
//     map((token) => {
//       if (token) {
//         // if token exists after loading, allow navigation
//         return true;
//       }

//       // If no token, redirect to the login page and block navigation
//       router.navigate(['/login']);
//       return false;
//     })
//   );
// };

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  // Phase 01: Proactive check
  // The current auth state
  return store.select(selectAuthState).pipe(
    take(1),
    map((authState) => {
      const now = new Date();
      const tokenExists = !!authState.accessToken;

      // Check if the token is expired
      const tokenIsExpired =
        authState.accessTokenExpiresAt &&
        new Date(authState.accessTokenExpiresAt) < now;

      if (tokenExists && tokenIsExpired) {
        // If the token is expired, proactively dispatch the refresh action.
        // The logic below will then wait for this refresh to complete.
        store.dispatch(AuthActions.refreshToken());
      }
      // We don't return a boolean here; we just let the stream continue to the next phase.
    }),
    // Phase 02 : Reactive wait
    switchMap(() =>
      store.select(selectIsLoading).pipe(
        filter((isLoading) => !isLoading),
        take(1),
        // Once loading is done, check the final token status
        switchMap(() => store.select(selectAccessToken)),
        map((token) => {
          if (token) {
            // If a valid token exists now allow access
            return true;
          }
          // If not, refresh must have failed. Block access
          router.navigate(['/login']);
          return false;
        })
      )
    )
  );
};