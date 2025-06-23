import {Injectable} from '@angular/core';
import {GameService} from "./games/game.service";
import {UnoResponse} from "../model/dto/uno/dto/response/uno-response.interface";
import {UnoPlayerResponse} from "../model/dto/uno/dto/response/uno-player-response.interface";
import {UnoPlayer} from "../model/dto/uno/entities/uno-player.interface";
import {UnoCard} from "../model/dto/uno/entities/uno-card.interface";

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
    return true;
  }

  updatePlayers(players: UnoPlayerResponse[]) {
    this.playersList.set(players as UnoPlayer[])
  }
}
