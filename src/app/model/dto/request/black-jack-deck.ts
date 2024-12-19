import {Card} from "./card";
import {BlackJackMessage} from "../../enum/black-jack-message";

export interface BlackjackDeck {
  playerHand: Set<Card>;
  dealerHand: Set<Card>;
  playerTotal: number;
  message: BlackJackMessage;
}
