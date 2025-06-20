import {GameResponse} from "../../game/response/game-response.interface";
import {Card} from "../../request/card";
import {PokerPlayerResponse} from "./poker-player-response.interface";

export interface PokerResponse extends GameResponse<PokerPlayerResponse> {
  dealerHand: Card[],
  pot: number,
  lastBet: number,
  nextPlayerId: string,
}
