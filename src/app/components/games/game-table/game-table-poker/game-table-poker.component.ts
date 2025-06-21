import {Component, Input, signal} from '@angular/core';
import {NgOptimizedImage, NgStyle} from "@angular/common";
import { CardHandComponent } from "../../card-hand/card-hand.component";
import { GameTableComponent } from '../game-table.component';
import {Card} from "../../../../model/dto/game/card.interface";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {PokerPlayer} from "../../../../model/dto/poker/poker-player.interface";
import {PokerBackHandComponent} from "./poker-back-hand/poker-back-hand.component";

@Component({
    selector: 'app-game-table',
  imports: [
    NgOptimizedImage,
    CardHandComponent,
    NzBadgeComponent,
    PokerBackHandComponent,
    NgStyle,
  ],
    templateUrl: './game-table-poker.component.html',
    standalone: true,
    styleUrl: './game-table-poker.component.scss'
})
export class GameTablePokerComponent extends GameTableComponent {

  @Input()
  river = signal<Card[]>([])
  @Input()
  currentPlayerId = signal<string>("")
  @Input()
  orderedPlayers = signal<PokerPlayer[]>([]);
  @Input()
  playerCards = signal<Card[]>([])
  @Input()
  playerId = signal<string>("")

  isPlayerTurn(playerId: string) : boolean {
    return this.currentPlayerId()  === playerId;
  }

  findCardImage(card: Card): string {
    return `assets/cards/${card.rank}${card.suit}.png`;
  }
}
