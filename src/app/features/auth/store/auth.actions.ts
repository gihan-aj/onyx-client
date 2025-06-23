import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../../core/models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth', // Feature name
  events: {
    // Action dispatched when user click the login button
    Login: props<{ email: string; password: string; deviceId: string }>(),

    // Action dispactched by our Effect after a successful API call
    'Login Success': props<{
      accessToken: string;
      refreshToken: string;
      expiresAt: Date;
      user: User;
    }>(),

    // Action dispactched by our Effect after a failed API call
    'Login Failure': props<{ error: string }>(),

    // Action dispactched by our Effect after a failed API call
    Logout: emptyProps(),
  },
});