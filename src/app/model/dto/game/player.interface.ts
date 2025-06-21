import {Avatar} from "./enum/avatar.enum";

export interface Player {
  playerId: string;
  username: string;
  avatar?: Avatar;
  hand: any[];
}
