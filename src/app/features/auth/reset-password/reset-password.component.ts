import { CommonModule } from '@angular/common';
import { Component, HostBinding, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { Store } from '@ngrx/store';
import { selectIsLoading } from '../store/auth.reducer';
import { AuthActions } from '../store/auth.actions';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    CustomInputComponent,
    FormFieldComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit{
  @HostBinding('class') classes = 'page-center';
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  passwordVisible = false;
  confirmPasswordVisible = false;
  email: string | null = null;
  token: string | null = null;

  resetForm = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  isLoading$ = this.store.select(selectIsLoading);
  get passwordMismatchError(): string | null {
    return this.resetForm.hasError('passwordMismatch') &&
      this.resetForm.get('confirmPassword')?.touched
      ? 'Passwords do not match.'
      : null;
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.email = this.route.snapshot.queryParamMap.get('email');

    if (!this.token || !this.email) {
      // Handle missing params, maybe show a notification and redirect
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    if(this.resetForm.valid && this.token && this.email){
      const { newPassword, confirmPassword} = this.resetForm.value;
      this.store.dispatch(AuthActions.resetPassword({
        email: this.email!,
        token: this.token!,
        newPassword: newPassword!,
        confirmPassword: confirmPassword!
      }))
    }
  }
}
