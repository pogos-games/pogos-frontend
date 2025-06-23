import {GameMode} from "../game/enum/game-mode.enum";
import {UserResponseDto} from "./user-response.dto";
import {GameType} from "../game/enum/game-type.enum";

export interface GameHistoryResponse {
  id: string,
  mode: GameMode,
  player1: UserResponseDto,
  player2: UserResponseDto | null,
  player3: UserResponseDto | null,
  player4: UserResponseDto | null,
  type: GameType,
  date: Date
}
