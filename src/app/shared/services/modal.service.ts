import { Injectable, Type, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalComponent } from '../components/modal/modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private rootViewContainerRef!: ViewContainerRef;
  private modalClose$ = new Subject<any>();

  constructor() {}

  public setRootViewContainerRef(vcRef: ViewContainerRef) {
    this.rootViewContainerRef = vcRef;
  }

  /**
   * Opens a modal dialog.
   * @param componentToRender The component to display inside the modal.
   * @param config Optional configuration for the modal.
   * @returns An observable that emits data when the modal is closed.
   */
  open<T>(componentToRender: Type<T>, config?: { title?: string, data?: any }){
    if(!this.rootViewContainerRef){
      console.error("Root ViewContainerRef not set for ModalService!");
      return this.modalClose$.asObservable();
    }

    // Create an instance of the ModalComponent shell
    const modalComponentRef = this.rootViewContainerRef.createComponent(ModalComponent);

    // Pass configuration to the modal shell
    modalComponentRef.instance.title = config?.title || ""
    modalComponentRef.instance.componentToRender = componentToRender;
    modalComponentRef.instance.data = config?.data;

    // Handling closing the modal
    const closeSub = modalComponentRef.instance.closeEvent.subscribe((data: any) => {
      this.modalClose$.next(data);
      modalComponentRef.destroy();
      closeSub.unsubscribe();
    });

    return this.modalClose$.asObservable();
  }
}
