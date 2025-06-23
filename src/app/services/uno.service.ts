import {Injectable} from '@angular/core';
import {GameService} from "./games/game.service";
import {UnoResponse} from "../model/dto/uno/dto/response/uno-response.interface";
import {UnoPlayerResponse} from "../model/dto/uno/dto/response/uno-player-response.interface";
import {UnoPlayer} from "../model/dto/uno/entities/uno-player.interface";
import {UnoCard} from "../model/dto/uno/entities/uno-card.interface";
import {GameMode} from "../model/dto/game/enum/game-mode.enum";

@Injectable({
  providedIn: 'root'
})
export class UnoService extends GameService<UnoResponse,UnoPlayer,UnoPlayerResponse,UnoCard>{

  constructor() {
    super();
    this.gameUrl = '/uno';
    this.initializeSocket();
  }

  checkStartGame(): boolean {
    if (this.playersList().length < 2 && this.gameMode == GameMode.MULTIPLAYER) {
      this.errorStartGame = "Insufficient players to start the game."
      return false
    }
    return this.playersList().length > 1 || this.gameMode == GameMode.SOLO;
  }

  updatePlayers(players: UnoPlayerResponse[]) {
    this.playersList.set(players as UnoPlayer[])
  }
}
