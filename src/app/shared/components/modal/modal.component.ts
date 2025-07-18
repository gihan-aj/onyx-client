import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  animations: [
    trigger('backdropFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('200ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
    trigger('modalSlide', [
      transition(':enter', [
        style({ transform: 'translateY(-50px)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate(
          '300ms ease-in',
          style({ transform: 'translateY(-50px)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class ModalComponent implements OnInit{
  @Input() title: string = "Dialog";
  @Input() componentToRender!: Type<any>;
  @Input() data: any // Data to passto the rendered component

  @Output() closeEvent = new EventEmitter<any>();

  // This is the container where we will dynamically load the content component
  @ViewChild('content', { read: ViewContainerRef, static: true}) containerVcr!: ViewContainerRef;
  
  // Listen for the Escape key to close the modal
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent){
    this.close();
  }

  ngOnInit(): void {
    // Create the component that user wants to display
    const componentRef = this.containerVcr.createComponent(this.componentToRender);

    // Pass the data to the created component if it has a 'data' property.
    if(this.data && componentRef.instance.data){
      componentRef.instance.data = this.data;
    }

    // Subscribe to the component's close event if it exists
    if(componentRef.instance.close){
      componentRef.instance.close.subscribe((data: any) => {
        this.close(data);
      })
    }
  }

  close(data: any = null){
    this.closeEvent.emit(data);
  }
}
