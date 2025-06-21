import {Card} from "../request/card";
import {Player} from "../game/player.interface";

export interface BlackJackPlayer extends Player {
  hand: Card[][];
  currentHandId: number;
  balance: number;
  bet: number;
  roundPlayed: boolean;
  isStanding: boolean;
}
