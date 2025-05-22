import {Card} from "./card";
import { PokerMessage } from "../../enum/poker.message.enum";

export interface PokerPlayerEvent {
    playerId: string;
    playerHand: Set<Card>;
    message: PokerMessage;
}
