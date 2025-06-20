import { GamePlayerResponse } from './game-player-response.interface';
import { GameStatus } from '../enum/game-status.enum';

export interface GameResponse<TPlayerResponse extends GamePlayerResponse> {
  gameId:string,
  players:TPlayerResponse[],
  status:GameStatus,
}
