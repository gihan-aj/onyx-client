import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    CustomInputComponent,
    ButtonComponent,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() data?: { user: User };

  @Output() close = new EventEmitter<any>();

  userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    isActive: [true, Validators.required],
  });

  isEditMode = false;

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.userForm.patchValue(this.data.user);
    }
  }

  onSave() {
    if (this.userForm.valid) {
      // Emit the form data and close the modal
      this.close.emit(this.userForm.value);
    }
  }

  onCancel() {
    // Emit null to signify cancellation
    this.close.emit(null);
  }
}
