import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../core/services/auth.service';
import { AuthActions } from './auth.actions';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { User } from '../../../core/models/user.model';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap((action) =>
        this.authService
          .login(action.email, action.password, action.deviceId)
          .pipe(
            tap((response) => console.log('RAW API RESPONSE:', response)),
            // If the API call is successful, transform the response and dispatch 'Login Success'
            map((response) => {
              // Create the User object for our state from the response
              const user: User = {
                id: response.userId,
                email: response.email,
                userCode: response.userCode,
              };

              // Dispatch the success action with the new, correct payload
              return AuthActions.loginSuccess({
                accessToken: response.token,
                refreshToken: response.refreshToken,
                expiresAt: new Date(response.tokenExpieryUtc), // Convert string to Date object
                user: user,
              });
            }),

            // If the API call fails, dispatch 'Login Failure'
            catchError((error) => {
              console.log('RAW API RESPONSE:', error);
              return of(
                AuthActions.loginFailure({
                  error: error.error.detail || 'Unknown authentication error',
                })
              );
            })
          )
      )
    )
  );

  // We will add an effect here to redirect the user after successful login
}
