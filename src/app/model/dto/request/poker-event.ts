import {Card} from "./card";
import { PokerMessage } from "../../enum/poker.message.enum";

export interface PokerEvent {
    dealerHand: Set<Card>;
    message: PokerMessage;
    nextPlayerId: string;
}
