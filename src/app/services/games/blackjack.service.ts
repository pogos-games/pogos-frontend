import {Injectable} from '@angular/core';
import {GameService} from "./game.service";

@Injectable({
  providedIn: 'root'
})
export class BlackjackService extends GameService{
  private playerBet: number = 0;

  constructor() {
    super();
    this.gameUrl = '/blackjack';
    this.initializeSocket();
  }
  override setBet(bet: number): void {
    this.playerBet = bet;
  }

  override getBet(): number {
    return this.playerBet;
  }
}

