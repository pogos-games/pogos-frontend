import {GameResponse} from "../../game/response/game-response.interface";
import {Card} from "../../request/card";
import {BlackJackPlayerResponse} from "./blackjack-player-response.interface";


export interface BlackJackResponse extends GameResponse<BlackJackPlayerResponse> {
  dealerHand: Card[],
}
