import {UnoCard} from "./uno-card.interface";
import {Avatar} from "../../enum/avatar.enum";

export  enum PlayerType  { HUMAN = "HUMAN", BOT = "BOT"}
export enum CardColor { RED = "RED", GREEN = "GREEN", BLUE = "BLUE", YELLOW = "YELLOW", WILD = "WILD" }
export enum CardType { NUMBER = "NUMBER", SKIP = "SKIP", REVERSE = "REVERSE", DRAW_TWO = "DRAW_TWO", WILD = "WILD", WILD_DRAW_FOUR = "WILD_DRAW_FOUR" }
export enum UnoDirection { CLOCKWISE = "CLOCKWISE", COUNTERCLOCKWISE = "COUNTERCLOCKWISE" }

export interface UnoPlayer {
  id: string;
  name: string;
  type: PlayerType;
  avatar: Avatar;
  handCount: number;
}


export interface UnoGameState {
  players: UnoPlayer[];
  topCard: UnoCard;
  currentTurnPlayerId: string;
  direction: UnoDirection;
  gameWinner: string;
}

export interface UnoGame {
  state: UnoGameState;
}

export interface PlayerPrivateState {
  hand: UnoCard[];
}
