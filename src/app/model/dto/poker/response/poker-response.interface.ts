import {GameResponse} from "../../game/response/game-response.interface";
import {PokerPlayerResponse} from "./poker-player-response.interface";
import {Card} from "../../game/card.interface";

export interface PokerResponse extends GameResponse<PokerPlayerResponse> {
  dealerHand: Card[],
  pot: number,
  lastBet: number,
  nextPlayerId: string,
}
