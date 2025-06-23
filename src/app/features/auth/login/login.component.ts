import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Store } from '@ngrx/store';
import { selectError, selectIsLoading } from '../store/auth.reducer';
import { AuthActions } from '../store/auth.actions';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  // Create the form group with validators
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  // Selectors to get data from the store
  isLoading$ = this.store.select(selectIsLoading);
  error$ = this.store.select(selectError);

  onSubmit(): void {
    if(this.loginForm.valid){
      const { email, password } = this.loginForm.getRawValue();

      // Simple device ID generation
      const deviceId = crypto.randomUUID();

      if(email && password){
        // Dispatch the login action to NgRx store
        this.store.dispatch(AuthActions.login({email, password, deviceId}))
      }
    }
  }
}
