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
  selector: 'app-resend-activation',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    CustomInputComponent,
    FormFieldComponent ,
  ],
  templateUrl: './resend-activation.component.html',
  styleUrl: './resend-activation.component.scss',
})
export class ResendActivationComponent {
  @HostBinding('class') classes = 'page-center';

  private fb = inject(FormBuilder);
  private store = inject(Store);

  resendForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  })

  isLoading$ = this.store.select(selectIsLoading);

  onSubmit(): void {
    if(this.resendForm.valid){
      const { email } = this.resendForm.value;
      this.store.dispatch(AuthActions.resendActivation({ email: email! }));
    }
  }
}
