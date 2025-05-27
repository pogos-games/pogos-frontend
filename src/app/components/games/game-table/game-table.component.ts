import {Component, Input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {GameDeck} from "../../../model/dto/request/game-deck";
import {Card} from "../../../model/dto/request/card";
import {CardHandComponent} from "../card-hand/card-hand.component";
import {GameActions} from "../../../model/enum/game.actions.enum";

@Component({
  selector: 'app-game-table',
  imports: [
    NgOptimizedImage,
    NzButtonComponent,
    NzSpinComponent,
    CardHandComponent
  ],
  templateUrl: './game-table.component.html',
  standalone: true,
  styleUrl: './game-table.component.scss'
})
export class GameTableComponent {
  protected gameDeck : GameDeck = { playerHand: new Set<Card>(), dealerHand: new Set<Card>(), playerTotal: 0, message: "CONTINUE" };
  @Input()
  public hands!: {
    player1Hand: Card[],
    player2Hand: Card[],
    player3Hand: Card[],
    dealerHand: Card[],
    selfHand: Card[]
  };

  executeAction(action : GameActions) : void {
    console.log('action : ',action)
  }

  protected readonly GameActions = GameActions;
}
