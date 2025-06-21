import { Directive, Input } from '@angular/core';
import { GameDeck } from '../../../model/dto/request/game-deck';
import { Card } from '../../../model/dto/request/card';
import { GameActions } from '../../../model/dto/game/enum/gateway/game.actions.enum';

@Directive()
export class GameTableComponent {
  protected gameDeck: GameDeck = { playerHand: new Set<Card>(), dealerHand: new Set<Card>(), playerTotal: 0, message: "CONTINUE" };
  @Input()
  public hands!: {
    player1Hand: Card[],
    player2Hand: Card[],
    player3Hand: Card[],
    dealerHand: Card[],
    selfHand: Card[]
  };

  executeAction(action: GameActions): void {
    console.log('action : ', action)
  }

  protected readonly GameActions = GameActions;
}
