import {GameService} from "../../../services/games/game.service";
import {PokerService} from "../../../services/games/poker.service";
import {BlackjackService} from "../../../services/games/blackjack.service";
import {Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class GameServiceFactory {
  private readonly serviceMap: { [key: string]: GameService };

  constructor(
    private blackjackService: BlackjackService,
    private pokerService: PokerService
  ) {
    this.serviceMap = {
      'BlackJack': this.blackjackService,
      'Poker': this.pokerService
    };
  }

  getService(title: string): GameService | undefined {
    return this.serviceMap[title];
  }
}
