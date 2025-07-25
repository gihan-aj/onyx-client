import {
  APP_INITIALIZER,
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

import { provideState, provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { authFeature } from './features/auth/store/auth.reducer';
import { AuthEffects } from './features/auth/store/auth.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { localStorageSync } from './core/store/local-storage-sync.reducer';
import { appInitializerFactory } from './core/store/app-init.factory';
import { UsersEffects } from './features/users/store/users.effects';
import { usersFeature } from './features/users/store/users.reducer';
import { PermissionEffects } from './features/permissions/store/permissions.effects';
import { RolesEffects } from './features/roles/store/roles.effects';
import { permissionsFeature } from './features/permissions/store/permissions.reducer';
import { rolesFeature } from './features/roles/store/roles.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [Store], // The factory depends on the NgRx Store
      multi: true,
    },
    // 1. Register the global Store
    provideStore({}, { metaReducers: [localStorageSync] }),

    // 2. Register the Effects
    provideEffects(AuthEffects, UsersEffects, PermissionEffects, RolesEffects),

    // Register our 'auth' feature state with the global store
    provideState(authFeature),
    provideState(usersFeature),
    provideState(permissionsFeature),
    provideState(rolesFeature),

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
