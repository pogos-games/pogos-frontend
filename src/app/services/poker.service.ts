import {Injectable} from '@angular/core';
import {GameService} from "./games/game.service";

@Injectable({
  providedIn: 'root'
})
export class PokerService extends GameService{

  protected override gameUrl: string = 'poker'
  constructor() {
    super();
  }
}
