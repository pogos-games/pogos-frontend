import {Component, computed, EventEmitter, HostListener, Input, Output, signal} from '@angular/core';
import {UnoPlayer} from "../../../../model/dto/uno/entities/uno-player.interface";
import {UnoEndAction} from "../../../../model/dto/uno/entities/uno-end-action.interface";
import {UnoEndActionType} from "../../../../model/dto/uno/enum/uno-end-action-type.enum";

@Component({
  selector: 'uno-declare-button',
  templateUrl: './uno-declare-button.component.html',
  standalone: true,
  styleUrl: './uno-declare-button.component.scss',
  imports: []
})
export class UnoDeclareButtonComponent {
  @Input({ required: true }) players = signal<UnoPlayer[]>([]);
  @Input({ required: true }) playerId = "";
  @Input({ required: true }) gameId = "";
  @Output() declareEvent = new EventEmitter<UnoEndAction>();

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key.toLowerCase() === 'p') {
      this.declare();
    }
  }

  readonly unoData = computed(() => {
    const unoPlayer = this.players().find(p => p.hand.length === 1 && !p.declaredUno);
    if (!unoPlayer) return null;
    const isSelf = unoPlayer.playerId === this.playerId;
    return {
      targetPlayerId: unoPlayer.playerId,
      unoType: isSelf ? 'Uno!' : 'Contre Uno!'
    };
  });

  declare(): void {
    const data = this.unoData();
    if (!data) return;

    const action: UnoEndAction = {
      roomId: this.gameId,
      type: data.unoType == 'Uno!' ? UnoEndActionType.DECLARE : UnoEndActionType.COUNTER,
      playerId: this.playerId,
      targetPlayerId: data.targetPlayerId
    };

    this.declareEvent.emit(action);
  }
}
