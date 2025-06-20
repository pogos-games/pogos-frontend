import { UnoCard } from '../../entities/uno-card.interface';
import {GamePlayerResponse} from "../../../game/response/game-player-response.interface";

export interface UnoPlayerResponse extends GamePlayerResponse{
  hand:UnoCard[];
  declaredUno: boolean;
}
