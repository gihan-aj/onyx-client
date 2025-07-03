import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

// Define the possible styles and sizes for the button
export type ButtonColor = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() color: ButtonColor = 'primary';
  @Input() type: ButtonType = 'button';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;

  @Output() onClick = new EventEmitter<MouseEvent>();

  getButtonClasses(): string[] {
    return [`btn-${this.color}`];
  }
}
