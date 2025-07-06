import { CommonModule } from '@angular/common';
import { Component, HostBinding, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { Store } from '@ngrx/store';
import { selectIsLoading } from '../store/auth.reducer';
import { AuthActions } from '../store/auth.actions';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    CustomInputComponent,
    FormFieldComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  @HostBinding('class') classes = 'page-center';
  private fb = inject(FormBuilder);
  private store = inject(Store);

  passwordVisible = false;
  confirmPasswordVisible = false;

  registerForm = this.fb.group(
    {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  isLoading$ = this.store.select(selectIsLoading);


  get passwordMismatchError(): string | null {
    const form = this.registerForm;
    const confirmPasswordTouched = form.get('confirmPassword')?.touched;

    return form.hasError('passwordMismatch') && confirmPasswordTouched
      ? 'Passwords do not match.'
      : null;
  }

  onSubmit() : void {
    if (this.registerForm.valid) {
      const { firstName, lastName, email, password, confirmPassword } = this.registerForm.value;
      
      this.store.dispatch(AuthActions.register({
        firstName: firstName!,
        lastName: lastName!,
        email: email!,
        password: password!,
        confirmPassword: confirmPassword!
      }));
    }
    else {
      this.registerForm.markAllAsTouched();
    }
  }
}
