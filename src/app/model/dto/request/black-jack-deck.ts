import {Card} from "./card";
import {BlackJackMessage} from "../../enum/black-jack.message.enum";

export interface BlackjackDeck {
  playerHand: Set<Card>;
  dealerHand: Set<Card>;
  playerTotal: number;
  message: BlackJackMessage;
}
