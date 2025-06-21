import { UnoCard } from './uno-card.interface';
import { Player } from "../../game/player.interface";

export interface UnoPlayer extends Player{
  hand: UnoCard[];
  declaredUno: boolean;
}
