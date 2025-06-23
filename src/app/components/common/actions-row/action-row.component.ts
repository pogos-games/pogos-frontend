import {Component, computed, EventEmitter, Input, Output, Signal, signal, WritableSignal} from '@angular/core';
import {ActionButtonComponent} from "../action-button/action-button.component";
import {JetonButtonComponent} from "../jeton-bouton/jeton-button/jeton-button.component";
import {NgForOf} from "@angular/common";
import {ActionDescriptor} from "../play-game-page/action-descriptor";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzWaveDirective} from "ng-zorro-antd/core/wave";
import {GameMode} from "../../../model/dto/game/enum/game-mode.enum";

@Component({
  selector: 'action-row',
  templateUrl: './action-row.component.html',
  standalone: true,
  imports: [
    ActionButtonComponent,
    JetonButtonComponent,
    NgForOf,
    NzButtonComponent,
    NzWaveDirective
  ],
  styleUrl: './action-row.component.scss'
})
export class ActionRowComponent {
  @Input({required: true}) actions: ActionDescriptor[] = [];
  @Input() secondaryActions: ActionDescriptor[] = [];
  @Input() isActionsDisabled: WritableSignal<boolean> = signal(false);
  @Input() isSecondaryActionsDisabled: WritableSignal<boolean> = signal(false);
  @Input() playerBalance: number = 0;
  @Input() playerBet: WritableSignal<number> = signal(0);
  @Input() totalPot: WritableSignal<number> = signal(0);
  @Input({required: true}) gameMode: string = "";
  @Input() showCoins: boolean = false;


  @Output() placeBet= new EventEmitter<number>();
  @Output() openChat= new EventEmitter();
  @Output() executeAction= new EventEmitter<string>();

  isBetSelected = false;


  isActionDisabledFor(action: ActionDescriptor): Signal<boolean> {
    return computed(() =>
      this.isActionsDisabled() || (action.text === 'Relancer' && !this.isBetSelected)
    );
  }



  emitAction(action: string){
    this.executeAction.emit(action);
    this.isBetSelected = false;
  }

  emitOpenChat(){
    this.openChat.emit();
  }

  emitPlaceBet(bet: number){
    this.placeBet.emit(bet);
    this.isBetSelected = true;
  }

  protected readonly GameMode = GameMode;
}
