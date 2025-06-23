import {Component, Input, signal} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {CardHandComponent} from "../../card-hand/card-hand.component";
import {GameTableComponent} from '../game-table.component';
import {Card} from "../../../../model/dto/game/card.interface";
import {PokerPlayer} from "../../../../model/dto/poker/poker-player.interface";
import {PokerPlayerComponent} from "../../poker/poker-player/poker-player.component";

@Component({
    selector: 'app-game-table',
  imports: [
    NgOptimizedImage,
    CardHandComponent,
    PokerPlayerComponent,
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
