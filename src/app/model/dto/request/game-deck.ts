import {Card} from "../game/card.interface";

export interface GameDeck {
  playerHand: Set<Card>;
  dealerHand: Set<Card>;
  playerTotal: number;
  message: string;
}
