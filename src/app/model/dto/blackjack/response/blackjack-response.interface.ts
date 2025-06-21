import {GameResponse} from "../../game/response/game-response.interface";
import {BlackJackPlayerResponse} from "./blackjack-player-response.interface";
import {Card} from "../../game/card.interface";


export interface BlackJackResponse extends GameResponse<BlackJackPlayerResponse> {
  dealerHand: Card[],
}
