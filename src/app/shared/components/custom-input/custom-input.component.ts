import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

export type InputType = 'text' | 'password' | 'email' | 'select';

@Component({
  selector: 'app-custom-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() type: InputType = 'text';
  @Input() placeholder: string = '';
  @Input() loading: boolean = false;
  @Input() options: { value: any; label: string }[] = [];
  @Input() name!: string;
  @Input() clickableIconClass: string | null = null;
  @Output() iconClick = new EventEmitter<void>();

  value: any;
  isDisabled = false;
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
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

  onSelectionChange(value: any) {
    this.onChange(value);
    this.onTouched();
  }

  onTextInputChange(event: Event) {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.onChange(target.value);
      this.onTouched();
    }
  }

  onIconClick(event: MouseEvent) {
    event.stopPropagation();
    this.iconClick.emit();
  }
}
