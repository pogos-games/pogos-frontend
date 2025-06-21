import {GamePlayerResponse} from "../../game/response/game-player-response.interface";
import {Card} from "../../request/card";

export interface PokerPlayerResponse extends GamePlayerResponse{
  hand:Card[];
  balance:number,
  bet:number,
  roundPlayed: boolean,
  allIn: number,
}
