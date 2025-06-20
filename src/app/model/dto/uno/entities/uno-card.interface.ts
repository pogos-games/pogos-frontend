import { BaseCard } from "../../game/card.interface";

export interface UnoCard extends BaseCard{
  color: UnoCardColor;
  type: UnoCardType;
  value?: number; // Only if type is Number
  declaredColor?: UnoCardColor;
}

export enum UnoCardType {
  NUMBER = 'NUMBER',
  SKIP = 'SKIP',
  REVERSE = 'REVERSE',
  DRAW_TWO = 'DRAW_TWO',
  WILD = 'WILD',
  WILD_DRAW_FOUR = 'WILD_DRAW_FOUR',
}


export enum UnoCardColor {
  RED = 'RED',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  WILD = 'WILD',
}
