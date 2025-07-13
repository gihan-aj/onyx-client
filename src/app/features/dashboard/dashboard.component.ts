import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAccessTokenExpiresAt, selectUser } from '../auth/store/auth.reducer';
import { AuthActions } from '../auth/store/auth.actions';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private store = inject(Store);

  user$ = this.store.select(selectUser);
  expiresAt$ = this.store.select(selectAccessTokenExpiresAt);

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
