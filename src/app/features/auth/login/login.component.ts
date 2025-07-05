import { CommonModule } from '@angular/common';
import { Component, HostBinding, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Store } from '@ngrx/store';
import { selectError, selectIsLoading } from '../store/auth.reducer';
import { AuthActions } from '../store/auth.actions';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FormFieldComponent,
    CustomInputComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  // This applies the .page-center utility class to the component's host element (<app-login>)
  @HostBinding('class') classes = 'page-center';

  private fb = inject(FormBuilder);
  private store = inject(Store);

  passwordVisible = false;

  // Create the form group with validators
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  // Selectors to get data from the store
  isLoading$ = this.store.select(selectIsLoading);
  // error$ = this.store.select(selectError);

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.getRawValue();

      // Simple device ID generation
      const deviceId = crypto.randomUUID();

      if (email && password) {
        // Dispatch the login action to NgRx store
        this.store.dispatch(AuthActions.login({ email, password, deviceId }));
      }
    }
  }
}
