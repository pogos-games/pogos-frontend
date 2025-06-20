import {Component, EventEmitter, Input, Output, WritableSignal, signal} from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import {NzButtonComponent} from "ng-zorro-antd/button";

@Component({
  selector: 'app-waiting-room-modal',
  standalone: true,
  imports: [NzModalModule, FormsModule, NzButtonComponent],
  templateUrl: './waiting-room-modal.component.html',
  styleUrls: ['./waiting-room-modal.component.scss']
})
export class WaitingRoomModalComponent{
  @Input({ required: true }) isVisible: WritableSignal<boolean> = signal(false);
  @Input({ required: true }) errorMessage: WritableSignal<string> = signal("");
  @Input({ required: true }) title: string = 'Salle d’attente';
  @Input({ required: true }) okText: string = 'Commencer';
  @Input({ required: true }) cancelText: string = 'Annuler';
  @Input() gameId: string | null = '';
  @Input() playersNames: WritableSignal<string[]> = signal([]);
  @Input() initialBet: WritableSignal<number> = signal(-1);
  @Input() showPrivacy: boolean = true;

  @Output() onOk: EventEmitter<number> = new EventEmitter<number>();
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() changePrivacy: EventEmitter<void> = new EventEmitter<void>();

  betAmount: number = 0;

  handleOk(): void {
    this.onOk.emit(this.betAmount);
  }

  handleCancel(): void {
    this.isVisible.set(false);
    this.onCancel.emit();
  }

  ngOnChanges(): void {
    this.betAmount = this.initialBet();
  }

  changePrivate(): void {
    this.changePrivacy.emit()
  }
}
