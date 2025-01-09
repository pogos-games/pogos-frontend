import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal',
  imports: [
    NzModalModule
  ],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input({ required: true }) isVisible: boolean = false; // Contrôle de la visibilité
  @Input({ required: true }) title: string = 'Titre de la modal'; // Titre de la modal
  @Input({ required: true }) description: string = 'Description ici...'; // Description de la modal
  @Input({ required: true }) okText: string = 'Oui'; // Texte du bouton "OK"
  @Input({ required: true }) cancelText: string = 'Non'; // Texte du bouton "Annuler"

  @Output() onOk: EventEmitter<void> = new EventEmitter<void>(); // Événement pour le bouton "OK"

  handleOk(): void {
    this.onOk.emit();
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
