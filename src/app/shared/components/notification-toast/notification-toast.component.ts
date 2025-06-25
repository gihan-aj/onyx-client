import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Notification } from '../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-toast',
  imports: [CommonModule],
  templateUrl: './notification-toast.component.html',
  styleUrl: './notification-toast.component.scss',
  animations: [
    trigger('state', [
      state('void', style({ transform: 'translateX(100%)', opacity: 0 })),
      state('visible', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('void => visible', animate('300ms ease-out')),
      transition('visible => void', animate('300ms ease-in')),
    ]),
  ],
})
export class NotificationToastComponent implements OnInit {
  @Input() notification!: Notification;
  @Output() closed = new EventEmitter<number>();

  private timer: any;

  ngOnInit(): void {
    if (this.notification.duration) {
      this.timer = setTimeout(() => this.close(), this.notification.duration);
    }
  }

  close() {
    clearTimeout(this.timer);
    this.closed.emit(this.notification.id);
  }

  onAnimationDone(event: any) {
    if (event.toState === 'void') {
      // Can perform cleanup after animation is fully done if needed
    }
  }
}
