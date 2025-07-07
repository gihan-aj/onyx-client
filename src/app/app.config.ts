import {
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { authFeature } from './features/auth/store/auth.reducer';
import { AuthEffects } from './features/auth/store/auth.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { localStorageSync } from './core/store/local-storage-sync.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    // 1. Register the global Store
    provideStore({}, { metaReducers: [localStorageSync] }),

    // 2. Register the Effects
    provideEffects(AuthEffects),

    // Register our 'auth' feature state with the global store
    provideState(authFeature),

    // 3. Register the Store DevTools and only enable it for development mode
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode in production
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, // Don't log stack traces
      traceLimit: 75, // Log limit
    }),
  ],
};
