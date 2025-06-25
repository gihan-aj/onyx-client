import { Component, inject } from '@angular/core';
import { Notification, NotificationService } from '../../services/notification.service';
import { NotificationToastComponent } from '../notification-toast/notification-toast.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-container',
  imports: [CommonModule, NotificationToastComponent],
  templateUrl: './notification-container.component.html',
  styleUrl: './notification-container.component.scss',
})
export class NotificationContainerComponent {
  private notificationService = inject(NotificationService);
  notifications: Notification[] = [];

  constructor() {
    this.notificationService.notifications$.subscribe((notification) => {
      this.notifications.push(notification);
    });
  }

  removeNotification(id: number) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

  trackById(index: number, notification: Notification): number {
    return notification.id;
  }
}
