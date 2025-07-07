import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../../core/models/user.model';
import {
  RegisterRequest,
  ResetPasswordRequest,
} from '../../../core/services/auth.service';

export const AuthActions = createActionGroup({
  source: 'Auth', // Feature name
  events: {
    // Login Flow
    Login: props<{ email: string; password: string; deviceId: string }>(),
    'Login Success': props<{
      accessToken: string;
      expiresAt: Date;
      user: User;
    }>(),
    'Login Failure': props<{ error: string }>(),

    // Regstration Flow
    Register: props<RegisterRequest>(),
    'Register Success': props<{ email: string }>(), // Pass email to the next page
    'Register Failure': props<{ error: string }>(),

    // Logout Flow
    Logout: emptyProps(),

    // Token Refresh Flow
    'Refresh Token': emptyProps(),
    'Refresh Token Success': props<{
      accessToken: string;
      expiresAt: Date;
      user: User;
    }>(),
    'Refresh Token Failure': props<{ error: string }>(),

    // Hydrate State from Storage
    'Hydrate Auth State': props<{
      accessToken: string | null;
      accessTokenExpiresAt: Date | null;
      user: User | null;
    }>(),

    // Activate Account Flow
    'Resend Activation': props<{ email: string }>(),
    'Resend Activation Success': emptyProps(),
    'Resend Activation Failure': props<{ error: string }>(),
    'Activate Account': props<{ token: string; email: string }>(),
    'Activate Account Success': emptyProps(),
    'Activate Account Failure': props<{ error: string }>(),

    // Password reset flow
    'Request Password Reset': props<{ email: string }>(),
    'Request Password Reset Success': emptyProps(),
    'Request Password Reset Failure': props<{ error: string }>(),
    'Reset Password': props<ResetPasswordRequest>(),
    'Reset Password Success': emptyProps(),
    'Reset Password Failure': props<{ error: string }>(),
  },
});
