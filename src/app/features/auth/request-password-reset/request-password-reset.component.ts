import { CommonModule } from '@angular/common';
import { Component, HostBinding, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { Store } from '@ngrx/store';
import { selectIsLoading } from '../store/auth.reducer';
import { AuthActions } from '../store/auth.actions';

@Component({
  selector: 'app-request-password-reset',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    CustomInputComponent,
    FormFieldComponent,
  ],
  templateUrl: './request-password-reset.component.html',
  styleUrl: './request-password-reset.component.scss',
})
export class RequestPasswordResetComponent {
  @HostBinding('class') classes = 'page-center';
  private fb = inject(FormBuilder);
  private store = inject(Store);

  requestForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isLoading$ = this.store.select(selectIsLoading);

  onSubmit() {
    if (this.requestForm.valid) {
      const { email } = this.requestForm.value;
      this.store.dispatch(AuthActions.requestPasswordReset({ email: email! }));
    }
  }
}
