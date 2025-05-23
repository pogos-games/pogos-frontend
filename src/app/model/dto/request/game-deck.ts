import {Card} from "./card";

export interface GameDeck {
  playerHand: Set<Card>;
  dealerHand: Set<Card>;
  playerTotal: number;
  message: string;
}
