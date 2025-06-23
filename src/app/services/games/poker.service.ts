import { Injectable } from '@angular/core';
import {GameService} from "./game.service";
import {PokerPlayerResponse} from "../../model/dto/poker/response/poker-player-response.interface";
import {PokerPlayer} from "../../model/dto/poker/poker-player.interface";
import {PokerResponse} from "../../model/dto/poker/response/poker-response.interface";
import {Card} from "../../model/dto/game/card.interface";

@Injectable({
  providedIn: 'root'
})
export class PokerService extends GameService<PokerResponse,PokerPlayer,PokerPlayerResponse,Card>{

  constructor() {
    super();
    this.gameUrl = '/poker';
    this.initializeSocket();
  }

  checkStartGame(): boolean {
    this.errorStartGame = "Insufficient players to start the game."
    return this.playersList().length > 1;
  }

  updatePlayers(players: PokerPlayerResponse[]) {
    this.playersList.set(players as PokerPlayer[])
  }
}

