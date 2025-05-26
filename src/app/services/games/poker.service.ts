import { Injectable } from '@angular/core';
import {GameService} from "./game.service";

@Injectable({
  providedIn: 'root'
})
export class PokerService extends GameService{

  constructor() {
    super();
    this.gameUrl = '/poker';
    this.initializeSocket();
  }
}

