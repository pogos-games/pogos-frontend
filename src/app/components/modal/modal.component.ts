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
  @Input() isVisible: boolean = false; // Contrôle de la visibilité
  @Input() title: string = 'Titre de la modal'; // Titre de la modal
  @Input() description: string = 'Description ici...'; // Description de la modal
  @Input() okText: string = 'Oui'; // Texte du bouton "OK"
  @Input() cancelText: string = 'Non'; // Texte du bouton "Annuler"

  @Output() onOk: EventEmitter<void> = new EventEmitter<void>(); // Événement pour le bouton "OK"
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>(); // Événement pour le bouton "Annuler"

  handleOk(): void {
    this.onOk.emit();
  }

  handleCancel(): void {
    this.onCancel.emit();
  }
}
