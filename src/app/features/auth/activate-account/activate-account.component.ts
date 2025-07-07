import { CommonModule } from '@angular/common';
import { Component, HostBinding, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectError, selectIsLoading } from '../store/auth.reducer';
import { AuthActions } from '../store/auth.actions';

@Component({
  selector: 'app-activate-account',
  imports: [CommonModule, ButtonComponent, RouterLink],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent implements OnInit{
  @HostBinding('class') classes = 'page-center';
  
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  isLoading$ = this.store.select(selectIsLoading);
  error$ = this.store.select(selectError);
  
  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');
    if (token && email) {
      this.store.dispatch(AuthActions.activateAccount({ token, email }));
    } else {
      // Handle case where params are missing
      this.store.dispatch(
        AuthActions.activateAccountFailure({
          error: 'Activation token or email is missing from the URL.',
        })
      );
    }
  }

}
