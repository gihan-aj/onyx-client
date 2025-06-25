import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  id: number;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number; // Duration in ms
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();

  private idSequence = 0;

  constructor() { }

  show(notification: Omit<Notification, 'id'>){
    this.idSequence++;
    this.notificationSubject.next({id: this.idSequence, ...notification});
  }

  showSuccess(message: string, duration = 5000){
    this.show({type: 'success', message, duration })
  }

  showError(message: string, duration = 7000){
    this.show({type: 'error', message, duration })
  }

  showInfo(message: string, duration = 5000){
    this.show({type: 'info', message, duration })
  }
  
  showWarning(message: string, duration = 6000){
    this.show({type: 'warning', message, duration })
  }
}
