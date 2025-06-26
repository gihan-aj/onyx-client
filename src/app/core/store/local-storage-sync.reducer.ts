import { ActionReducer } from '@ngrx/store';
import { AuthActions } from '../../features/auth/store/auth.actions';

const AUTH_STATE_KEY = 'authState';

export function localStorageSync(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return (action, state) => {
    const nextState = reducer(action, state);

    // After every action, check the action type
    if (
      action.type === AuthActions.loginSuccess.type ||
      action.type === AuthActions.refreshTokenSuccess.type
    ) {
      // On success, save the relevant part of the state to local storage
      const authStateToSave = nextState.auth;
      localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(authStateToSave));
    }

    if (
      action.type === AuthActions.logout.type ||
      action.type === AuthActions.refreshTokenFailure.type
    ) {
      // On logout or fresh token failure remove state from storage
      localStorage.removeItem(AUTH_STATE_KEY);
    }

    return nextState;
  };
}

// Function to get the initial state from localStorage when the app loads
export function getInitialAuthState(){
    const savedState = localStorage.getItem(AUTH_STATE_KEY);
    return savedState? JSON.parse(savedState) : undefined;
}
