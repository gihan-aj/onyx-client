import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../core/services/auth.service';
import { AuthActions } from './auth.actions';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlingService } from '../../../core/services/error-handling.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private errorHandlingService = inject(ErrorHandlingService);
  private router = inject(Router);

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

              this.notificationService.showSuccess(
                'Login successful. Welcome!'
              );

              // Dispatch the success action with the new payload
              return AuthActions.loginSuccess({
                accessToken: response.token,
                expiresAt: new Date(response.tokenExpiryUtc), // Convert string to Date object
                user: user,
              });
            }),

            // Updated catchError block
            catchError((error: HttpErrorResponse) => {
              // Use a helper function to parse the structured error from your backend
              const errorMessage =
                this.errorHandlingService.parseHttpError(error);
              this.notificationService.showError(errorMessage);
              return of(AuthActions.loginFailure({ error: errorMessage }));
            })
          )
      )
    )
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      exhaustMap(() =>
        this.authService.refreshToken().pipe(
          map((response) => {
            const user: User = {
              id: response.userId,
              email: response.email,
              userCode: response.userCode,
            };

            this.notificationService.showSuccess('Session has been refreshed.');

            return AuthActions.refreshTokenSuccess({
              accessToken: response.token,
              expiresAt: new Date(response.tokenExpiryUtc),
              user: user,
            });
          }),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.parseHttpError(error);
            this.notificationService.showError(
              `Session expired: ${errorMessage}`
            );
            return of(AuthActions.refreshTokenFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Redirect to dashboard after successful login
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    { dispatch: false } // This effect does not dispatch a new action
  );

  // Redirect to login page after logout
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  );
}
