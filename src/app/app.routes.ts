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
import { LayoutComponent } from './core/layout/layout.component';
import { UserListComponent } from './features/users/user-list/user-list.component';

export const routes: Routes = [
  // Public routes that are only for unauthenticated users
  {
    path: '',
    canActivate: [publicGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'resend-activation', component: ResendActivationComponent },
      {
        path: 'request-password-reset',
        component: RequestPasswordResetComponent,
      },
      { path: 'reset-password', component: ResetPasswordComponent },
    ],
  },

  // Static routes that don't need a specific guard
  { path: 'awaiting-activation', component: AwaitingActivationComponent },
  { path: 'activate-account', component: ActivateAccountComponent },

  // --- Authenticated Routes ---
  // All routes within this section will use the LayoutComponent as their shell
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UserListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Fallback route
  { path: '**', redirectTo: 'dashboard' },
];
