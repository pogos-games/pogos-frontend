import { Directive, Input } from '@angular/core';
import { GameDeck } from '../../../model/dto/request/game-deck';
import { GameActions } from '../../../model/dto/game/enum/gateway/game.actions.enum';
import {Card} from "../../../model/dto/game/card.interface";

@Directive()
export class GameTableComponent {
  protected gameDeck: GameDeck = { playerHand: new Set<Card>(), dealerHand: new Set<Card>(), playerTotal: 0, message: "CONTINUE" };
  
  @Input()
  public hands: {
    player1Hand: Card[],
    player2Hand: Card[],
    player3Hand: Card[],
    dealerHand: Card[],
    selfHand: Card[]
  }= {
    player1Hand: [],
    player2Hand: [],
    player3Hand: [],
    selfHand: [],
    dealerHand: [],
  };

  // Nouveau: pour indiquer si la partie est terminée
  @Input() gameEnded: boolean = false;

  protected readonly GameActions = GameActions;
}