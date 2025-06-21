import {Player} from "../game/player.interface";
import {Card} from "../game/card.interface";

export interface PokerPlayer extends Player {
  hand: Card[];
  balance: number;
  bet: number
  hasFolded: boolean;
  roundPlayed: boolean;
  allIn: number;
}
