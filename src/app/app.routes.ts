import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './features/auth/register/register.component';
import { AwaitingActivationComponent } from './features/auth/awaiting-activation/awaiting-activation.component';
import { ActivateAccountComponent } from './features/auth/activate-account/activate-account.component';
import { ResendActivationComponent } from './features/auth/resend-activation/resend-activation.component';
import { RequestPasswordResetComponent } from './features/auth/request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  // Default route now redirects to the dashboard.
  // The guards will handle redirecting to login if necessary.
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // --- Public Routes ---
  // These routes should only be accessible to unauthenticated users.
  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [publicGuard],
  },
  {
    path: 'resend-activation',
    component: ResendActivationComponent,
    canActivate: [publicGuard],
  },
  {
    path: 'request-password-reset',
    component: RequestPasswordResetComponent,
    canActivate: [publicGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [publicGuard],
  },

  // --- Static Routes (no guard needed for now) ---
  { path: 'awaiting-activation', component: AwaitingActivationComponent },
  { path: 'activate-account', component: ActivateAccountComponent },

  // --- Protected Routes ---
  // These routes are only for authenticated users.
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
];
