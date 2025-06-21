import {Player} from "../game/player.interface";
import {Card} from "../game/card.interface";

export interface BlackJackPlayer extends Player {
  hand: Card[][];
  currentHandId: number;
  balance: number;
  bet: number;
  roundPlayed: boolean;
  isStanding: boolean;
}
