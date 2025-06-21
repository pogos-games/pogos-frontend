import {GameService} from "../../../services/games/game.service";
import {PokerService} from "../../../services/games/poker.service";
import {BlackjackService} from "../../../services/games/blackjack.service";
import {Injectable} from "@angular/core";
import {UnoService} from "../../../services/uno.service";

@Injectable({ providedIn: 'root' })
export class GameServiceFactory {
  private readonly serviceMap: { [key: string]: GameService<any, any, any, any> };

  constructor(
    private readonly blackjackService: BlackjackService,
    private readonly pokerService: PokerService,
    private readonly unoService: UnoService
  ) {
    this.serviceMap = {
      'blackjack': this.blackjackService,
      'poker': this.pokerService,
      'uno': this.unoService
    };
  }

  getService(title: string): GameService<any, any, any, any> | undefined {
    return this.serviceMap[title.toLowerCase()];
  }
}
