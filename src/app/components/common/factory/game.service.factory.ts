import {GameService} from "../../../services/games/game.service";
import {PokerService} from "../../../services/games/poker.service";
import {BlackjackService} from "../../../services/games/blackjack.service";
import {Injectable} from "@angular/core";
import {UnoService} from "../../../services/uno.service";

@Injectable({ providedIn: 'root' })
export class GameServiceFactory {
  private readonly serviceMap: { [key: string]: GameService };

  constructor(
    private readonly blackjackService: BlackjackService,
    private readonly pokerService: PokerService,
    private readonly unoService: UnoService
  ) {
    this.serviceMap = {
      'BlackJack': this.blackjackService,
      'Poker': this.pokerService,
      'Uno': this.unoService
    };
  }

  getService(title: string): GameService | undefined {
    return this.serviceMap[title];
  }
}
