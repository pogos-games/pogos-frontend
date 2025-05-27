import {Component, EventEmitter, Input, Output, WritableSignal, signal} from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-waiting-room-modal',
  standalone: true,
  imports: [NzModalModule, FormsModule, NgFor],
  templateUrl: './waiting-room-modal.component.html',
  styleUrls: ['./waiting-room-modal.component.scss']
})
export class WaitingRoomModalComponent{
  @Input({ required: true }) isVisible: WritableSignal<boolean> = signal(false);
  @Input({ required: true }) title: string = 'Salle d’attente';
  @Input({ required: true }) okText: string = 'Commencer';
  @Input({ required: true }) cancelText: string = 'Annuler';
  @Input() gameId: string | null = '';
  @Input() players: string[] = [];
  @Input() initialBet: WritableSignal<number> = signal(-1);

  @Output() onOk: EventEmitter<number> = new EventEmitter<number>();
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();

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
}
