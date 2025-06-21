import { UnoCard } from '../../entities/uno-card.interface';
import { UnoGameDirection } from '../../enum/uno-game-direction.enum';
import {GameResponse} from "../../../game/response/game-response.interface";
import {UnoPlayerResponse} from "./uno-player-response.interface";

export interface UnoResponse extends GameResponse<UnoPlayerResponse> {
  deck: UnoCard[],
  discardPile: UnoCard[];
  currentTurnPlayerId: string;
  direction: UnoGameDirection;
  winnerUsername?: string;
}
