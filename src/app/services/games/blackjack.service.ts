import {Injectable} from '@angular/core';
import {GameService} from "./game.service";

@Injectable({
  providedIn: 'root'
})
export class BlackjackService extends GameService{
  protected override gameUrl: string = 'blackjack'
  private playerBet: number = 0;
  constructor() {
    super();
  }
  override setBet(bet: number): void {
    this.playerBet = bet;
  }

  override getBet(): number {
    return this.playerBet;
  }
}

