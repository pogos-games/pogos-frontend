import {Component, Input, signal, WritableSignal} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {PokerBackHandComponent} from "../../game-table/game-table-poker/poker-back-hand/poker-back-hand.component";
import {PokerPlayer} from "../../../../model/dto/poker/poker-player.interface";

@Component({
  selector: 'app-poker-player',
  imports: [
    NgOptimizedImage,
    NzBadgeComponent,
    PokerBackHandComponent
  ],
  templateUrl: './poker-player.component.html',
  styleUrl: './poker-player.component.scss'
})
export class PokerPlayerComponent {

  constructor() {
    console.log('into poker player')
  }

  @Input({required:true}) pokerPlayer: PokerPlayer = {
  hand: [],
  playerId:'',
  balance: 0,
  bet: 0,
  hasFolded: false,
  roundPlayed: false,
  allIn: 0
  }

  @Input({required: true}) isPlayerTurn: boolean = false;

  @Input({ required: true }) direction: 'left' | 'right' | 'top' = 'top';

}
