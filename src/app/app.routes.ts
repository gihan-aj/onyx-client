import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './features/auth/register/register.component';
import { AwaitingActivationComponent } from './features/auth/awaiting-activation/awaiting-activation.component';
import { ActivateAccountComponent } from './features/auth/activate-account/activate-account.component';
import { ResendActivationComponent } from './features/auth/resend-activation/resend-activation.component';

export const routes: Routes = [
  // When the user goes to the root URL, show the LoginComponent
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },

  // Specific path for login
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  { path: 'awaiting-activation', component: AwaitingActivationComponent },
  { path: 'activate-account', component: ActivateAccountComponent },
  { path: 'resend-activation', component: ResendActivationComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
];
