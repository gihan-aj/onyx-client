import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChild, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  imports: [CommonModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss'
})
export class FormFieldComponent implements AfterContentInit {
  @Input() label!: string;
  @ContentChild(NgControl) ngControl!: NgControl;

  get hasError(): boolean {
    return !!(this.ngControl?.control && this.ngControl.touched && this.ngControl.invalid);
  }

  get errorMessage(): string {
    const errors = this.ngControl?.control?.errors;
    if(errors){
      if(errors['required']) return `${this.label} is required.`;
      if(errors['email']) return 'Please enter a valid email address.';
      // Add other generic error messages here
    }

    return '';
  }

  ngAfterContentInit(): void {
    if(!this.ngControl){
      console.error(
        'app-form-field must contain a form control with formControlName or ngModel'
      );
    }
  }

}
