import { CommonModule } from '@angular/common';
import { Component, HostBinding, inject, OnDestroy } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  selectIsLoading,
  selectPendingActivationEmail,
} from '../store/auth.reducer';
import { Subject, takeUntil } from 'rxjs';
import { AuthActions } from '../store/auth.actions';

@Component({
  selector: 'app-awaiting-activation',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './awaiting-activation.component.html',
  styleUrl: './awaiting-activation.component.scss',
})
export class AwaitingActivationComponent implements OnDestroy {
  @HostBinding('class') classes = 'page-center';
  private store = inject(Store);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  userEmail: string | null = null;

  email$ = this.store.select(selectPendingActivationEmail);
  isLoading$ = this.store.select(selectIsLoading);

  constructor() {
    // If the user lands on this page directly without an email in the state,
    // redirect them to the register pag
    this.email$.pipe(takeUntil(this.destroy$)).subscribe((email) => {
      this.userEmail = email;
      if (!email) this.router.navigate(['/register']);
    });
  }

  resend() {
    if (this.userEmail) {
      this.store.dispatch(
        AuthActions.resendActivation({ email: this.userEmail })
      );
    }
  }

  ngOnDestroy(): void {
    // Clean up the subscription to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
}
