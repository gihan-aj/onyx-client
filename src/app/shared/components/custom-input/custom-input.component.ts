import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputType = 'text' | 'password' | 'email' | 'select';

@Component({
  selector: 'app-custom-input',
  imports: [CommonModule],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor{
  @Input() type: InputType = 'text';
  @Input() placeholder: string = '';
  @Input() loading: boolean = false;
  @Input() options: { value: any; label: string }[] = [];
  @Input() name!: string // Used for the 'for' attribute on the label

  value: any;
  isDisabled = false;
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value)
    this.onTouched();
  }

  onSelectionChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.onChange(value);
    this.onTouched();
  }

}
