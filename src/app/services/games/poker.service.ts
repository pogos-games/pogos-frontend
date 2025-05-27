import { Injectable } from '@angular/core';
import {GameService} from "./game.service";

@Injectable({
  providedIn: 'root'
})
export class PokerService extends GameService{

  override getGameType(){
    return 'HOLDEM'
  }

  constructor() {
    super();
    this.gameUrl = '/poker';
    this.initializeSocket();
  }

  checkStartGame(): boolean {
    return this.players.length > 1;
  }
}

