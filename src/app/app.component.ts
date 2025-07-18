import {
  AfterViewInit,
  Component,
  inject,
  ViewContainerRef,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationContainerComponent } from './shared/components/notification-container/notification-container.component';
import { ModalService } from './shared/services/modal.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  title = 'onyx-client';

  private modalService = inject(ModalService);
  private vcRef = inject(ViewContainerRef);

  ngAfterViewInit(): void {
    // Set the root ViewContainerRef for the service to use
    this.modalService.setRootViewContainerRef(this.vcRef);
  }
}
