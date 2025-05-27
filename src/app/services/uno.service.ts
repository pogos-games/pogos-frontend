import {Injectable} from '@angular/core';
import {GameService} from "./games/game.service";

@Injectable({
  providedIn: 'root'
})
export class UnoService extends GameService{

  constructor() {
    super();
    this.gameUrl = '/uno';
    this.initializeSocket();
  }




}
