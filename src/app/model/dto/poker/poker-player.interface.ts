import {Card} from "../request/card";
import {Player} from "../game/player.interface";

export interface PokerPlayer extends Player {
  hand: Card[];
  balance: number;
  bet: number
  hasFolded: boolean;
  roundPlayed: boolean;
  allIn: number;
}
