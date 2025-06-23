import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  // When the user goes to the root URL, show the LoginComponent
  {
    path: '',
    component: LoginComponent,
  },

  // Specific path for login
  {
    path: 'login',
    component: LoginComponent,
  },
];
