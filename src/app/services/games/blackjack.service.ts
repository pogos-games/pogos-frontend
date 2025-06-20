import {Injectable, signal, WritableSignal} from '@angular/core';
import {GameService} from "./game.service";
import {Card} from "../../model/dto/request/card";
import {BlackJackPlayer} from "../../model/dto/blackjack/blackjack-player.interface";
import {BlackJackResponse} from "../../model/dto/blackjack/response/blackjack-response.interface";
import {BlackJackPlayerResponse} from "../../model/dto/blackjack/response/blackjack-player-response.interface";

@Injectable({
  providedIn: 'root'
})
export class BlackjackService extends GameService<BlackJackResponse,BlackJackPlayer,BlackJackPlayerResponse,Card>{
  private playerBet: number = 0;
  public override playersList: WritableSignal<BlackJackPlayer[]> = signal([]);

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

  override checkStartGame(): boolean {
    return true;
  }
}

