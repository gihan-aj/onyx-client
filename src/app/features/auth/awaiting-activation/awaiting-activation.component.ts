import { CommonModule } from '@angular/common';
import { Component, HostBinding, inject } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  selectIsLoading,
  selectPendingActivationEmail,
} from '../store/auth.reducer';
import { filter, take } from 'rxjs';
import { AuthActions } from '../store/auth.actions';

@Component({
  selector: 'app-awaiting-activation',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './awaiting-activation.component.html',
  styleUrl: './awaiting-activation.component.scss',
})
export class AwaitingActivationComponent {
  @HostBinding('class') classes = 'page-center';
  private store = inject(Store);
  private router = inject(Router);

  email$ = this.store.select(selectPendingActivationEmail);
  isLoading$ = this.store.select(selectIsLoading);

  constructor() {
    // If the user lands on this page directly without an email in the state,
    // redirect them to the register pag
    this.email$
      .pipe(
        take(1),
        filter((email) => !email)
      )
      .subscribe(() => this.router.navigate(['/register']));
  }

  resend(){
    // if(email){
    //   // this.store.dispatch(AuthActions.resendActivation({ email }));
    // }
  }
}
