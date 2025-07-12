import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { selectAccessToken, selectIsLoading } from '../../features/auth/store/auth.reducer';
import { catchError, exhaustMap, filter, switchMap, take, throwError } from 'rxjs';
import { AuthActions } from '../../features/auth/store/auth.actions';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const actions$ = inject(Actions);

  // Get the access token from the state
  return store.select(selectAccessToken)
    .pipe(take(1),
    exhaustMap(token => {
    // If there is no token, just pass the request
    if(!token){
      return next(req);
    }

    // Clone the request and set the Authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      // withCredentials: true,
    });

    // Pass the cloned request to the next handler
    return next(authReq).pipe(
      catchError((error) => {
        // Check if it is a 401 error
        if( error instanceof HttpErrorResponse && error.status === 401 ){
          return handle401Error(req, next, store, actions$);
        }

        // For all other errors, re-throw
        return throwError(() => error);
      })
    )
    })
  )
};

function handle401Error(req: HttpRequest<any>, next: HttpHandlerFn, store: Store, actions$: Actions){
  // Prevent an infinite loop if the refresh token call itself fails
  if (req.url.includes('/refresh-token')) {
    store.dispatch(AuthActions.logout());
    return throwError(() => 'Refresh token failed. Logging out.');
  }

  // To prevent multiple refresh calls from firing at once
  if (isRefreshing) {
    // If a refresh is already in progress, wait for it to complete
    return store.select(selectIsLoading).pipe(
      filter((isLoading) => !isLoading),
      take(1),
      switchMap(() => store.select(selectAccessToken)),
      take(1),
      switchMap((newToken) => {
        return next(addTokenToRequest(req, newToken));
      })
    );
  }

  isRefreshing = true;
  store.dispatch(AuthActions.refreshToken());

  // Wait for the refresh action to succeed or fail
  return actions$.pipe(
    ofType(AuthActions.refreshTokenSuccess, AuthActions.refreshTokenFailure),
    take(1),
    switchMap((action) => {
      isRefreshing = false;
      if (action.type === AuthActions.refreshTokenSuccess.type) {
        // If the refresh was successful, get the new token and retry the request
        const newToken = action.accessToken;
        return next(addTokenToRequest(req, newToken));
      } else {
        // If refresh failed, the logout effect will handle redirection.
        // Just propagate the error to cancel the original request chain.
        return throwError(() => new Error('Session expired.'));
      }
    })
  );
}

// Helper function to add the token to the request
function addTokenToRequest(req: HttpRequest<any>, token: string | null) : HttpRequest<any> {
  if(!token) return req;
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
}
