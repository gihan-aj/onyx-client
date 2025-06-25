import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAccessToken } from '../../features/auth/store/auth.reducer';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  
  // Check the store for an access token
  return store.select(selectAccessToken).pipe(
    take(1), // Take the first valaue and then completes the observable
    map(token => {
      if(token){
        // if token exists allow navigation
        return true;
      }

      // If no token, redirect to the login page and block navigation
      router.navigate(['/login'])
      return false;
    })
  )
};
