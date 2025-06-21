import {GamePlayerResponse} from "../../game/response/game-player-response.interface";
import {Card} from "../../game/card.interface";

export interface BlackJackPlayerResponse extends GamePlayerResponse{
  hand:Card[][],
  currentHandId: number,
  balance:number,
  bet:number,
  roundPlayed: boolean;
  isStanding: boolean
}
