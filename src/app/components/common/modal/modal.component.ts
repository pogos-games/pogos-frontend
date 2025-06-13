import {Component, EventEmitter, Input, Output, signal, WritableSignal} from '@angular/core';
import {NzModalModule} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal',
  imports: [
    NzModalModule
  ],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input({ required: true }) isVisible: WritableSignal<boolean> = signal(false);
  @Input({ required: true }) title: string = ''; // Titre de la modal
  @Input({ required: true }) description: string = '';
  @Input({ required: true }) okText: string = '';
  @Input({ required: true }) cancelText: string = ''

  @Output() onOk: EventEmitter<void> = new EventEmitter<void>(); // Événement pour le bouton "OK"

  handleOk(): void {
    this.onOk.emit();
  }

  handleCancel(): void {
    this.isVisible.set(false);
  }
}
