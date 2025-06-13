import {UnoCard, UnoCardColor} from "./uno-card.interface";

export enum UnoActionType{
  DRAW_CARD = 'DRAW_CARD',
  PLAY_CARD = 'PLAY_CARD'
}

export interface UnoAction {
  roomId: string;
  type: UnoActionType;
  playerId: string; // Optional, depending on the action
  card?: UnoCard;
  declaredColor?: UnoCardColor; // For declaring color in WILD actions
}
