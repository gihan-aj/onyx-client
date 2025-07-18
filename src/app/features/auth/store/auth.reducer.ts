import { createFeature, createReducer, on } from "@ngrx/store";
import { User } from "../../../core/models/user.model";
import { AuthActions } from "./auth.actions";

// Define the state of authentication state
export interface AuthState {
  accessToken: string | null;
  accessTokenExpiresAt: Date | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  pendingActivationEmail: string | null;
}

// Set the initial state when the app loads
export const initialState: AuthState = {
  accessToken: null,
  accessTokenExpiresAt: null,
  user: null,
  isLoading: false,
  error: null,
  pendingActivationEmail: null,
};

// The createFeature function is a modern way to create the reducer and selectors
export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    // When login action is dispatched, set isLoading to true
    on(AuthActions.login, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),

    // On success, store the token/user and reset loading state
    on(AuthActions.loginSuccess, (state, { accessToken, expiresAt, user }) => ({
      ...state,
      isLoading: false,
      accessToken: accessToken,
      accessTokenExpiresAt: expiresAt,
      user: user,
      error: null,
    })),

    // On failure, clear user/token, stop loading, and store the error message
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      accessToken: null,
      accessTokenExpiresAt: null,
      user: null,
      error: error,
    })),

    // Register
    on(AuthActions.register, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),

    on(AuthActions.registerSuccess, (state, { email }) => ({
      ...state,
      isLoading: false,
      pendingActivationEmail: email,
      error: null,
    })),

    on(AuthActions.registerFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error: error,
    })),

    // On logout, reset the entire state to its initial value
    on(AuthActions.logoutSuccess, () => initialState),

    // Refresh token
    on(AuthActions.refreshToken, (state) => ({ ...state, isLoading: true })),

    on(
      AuthActions.refreshTokenSuccess,
      (state, { accessToken, expiresAt, user }) => ({
        ...state,
        isLoading: false,
        accessToken,
        accessTokenExpiresAt: expiresAt,
        user,
      })
    ),

    on(AuthActions.refreshTokenFailure, (state, { error }) => ({
      ...initialState, // On refresh failure, log the user out completely
      error: error,
    })),

    // Hydrate from storage
    on(AuthActions.hydrateAuthState, (state, hydratedState) => ({
      ...state,
      ...hydratedState,
    })),

    // Activation
    on(AuthActions.resendActivation, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(AuthActions.resendActivationSuccess, (state) => ({
      ...state,
      isLoading: false,
    })),
    on(AuthActions.resendActivationFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    on(AuthActions.activateAccount, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(AuthActions.activateAccountSuccess, (state) => ({
      ...state,
      isLoading: false,
    })),
    on(AuthActions.activateAccountFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Password reset
    on(AuthActions.requestPasswordReset, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(AuthActions.requestPasswordResetSuccess, (state) => ({
      ...state,
      isLoading: false,
    })),
    on(AuthActions.requestPasswordResetFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    on(AuthActions.resetPassword, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(AuthActions.resetPasswordSuccess, (state) => ({
      ...state,
      isLoading: false,
    })),
    on(AuthActions.resetPasswordFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    }))
  ),
});

// We can export the selectors generated by createFeature for easy use
export const {
  selectAccessToken,
  selectAccessTokenExpiresAt,
  selectUser,
  selectIsLoading,
  selectError,
  selectAuthState,
  selectPendingActivationEmail,
} = authFeature;