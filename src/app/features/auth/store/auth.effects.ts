import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../core/services/auth.service';
import { AuthActions } from './auth.actions';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ProblemDetails,
  ValidationProblemDetails,
} from '../../../core/models/error.model';
import { ErrorHandlingService } from '../../../core/services/error-handling.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private errorHandlingService = inject(ErrorHandlingService);

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
              ); // Show success notification

              // Dispatch the success action with the new, correct payload
              return AuthActions.loginSuccess({
                accessToken: response.token,
                refreshToken: response.refreshToken,
                expiresAt: new Date(response.tokenExpieryUtc), // Convert string to Date object
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

  // We will add an effect here to redirect the user after successful login
}
