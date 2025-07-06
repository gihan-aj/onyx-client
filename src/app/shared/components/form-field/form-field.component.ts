import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChild, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  imports: [CommonModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent implements AfterContentInit {
  @Input() label!: string;
  @Input() customError: string | null = null;

  @ContentChild(NgControl) ngControl!: NgControl;

  get hasError(): boolean {
    const controlIsInvalid = !!(
      this.ngControl?.control &&
      this.ngControl.touched &&
      this.ngControl.invalid
    );
    return controlIsInvalid || !!this.customError;
  }

  get errorMessage(): string {
    // Priority 1: Always show the custom error from the parent if it exists.
    if (this.customError) {
      return this.customError;
    }

    const errors = this.ngControl?.control?.errors;
    if (!errors) {
      return '';
    }

    // Priority 2: A prioritized list of known validation errors.
    // The loop will stop and return the message for the first error it finds in this order.
    const errorPriority = ['required', 'email', 'minlength'];

    for (const key of errorPriority) {
      if (errors[key]) {
        switch (key) {
          case 'required':
            return `${this.label} is required.`;
          case 'email':
            return 'Please enter a valid email address.';
          case 'minlength':
            // Access the error object to get details like requiredLength
            return `${this.label} must be at least ${errors[key].requiredLength} characters.`;
          // Add more cases for other validators here as your app grows
        }
      }
    }

    // Fallback for any other, unknown errors.
    return 'Invalid input.';
  }

  ngAfterContentInit(): void {
    if (!this.ngControl) {
      console.error(
        'app-form-field must contain a form control with formControlName or ngModel'
      );
    }
  }
}
