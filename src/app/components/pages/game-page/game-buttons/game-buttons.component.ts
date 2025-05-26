import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {GameActions} from "../../../../model/enum/game.actions.enum";
import {GameType} from "../../../../model/enum/game-type.enum";
import {GameServiceFactory} from "../../../common/factory/game.service.factory";
import {GameService} from "../../../../services/games/game.service";

@Component({
  selector: 'app-game-buttons',
  imports: [
    NzButtonComponent,
    RouterLink,
    NzColDirective,
    NzRowDirective
  ],
  templateUrl: './game-buttons.component.html',
  standalone: true,
  styleUrl: './game-buttons.component.scss'
})
export class GameButtonsComponent {

  @Output() showModalEvent = new EventEmitter<GameService>();

  @Input() gameName: string = "BlackJack";

  constructor(private readonly gameServiceFactory: GameServiceFactory) {
  }

  protected showModal() {
    let gameService = this.gameServiceFactory.getService(this.gameName);

    if (!gameService) {
      console.error(`No service found for game title: ${this.gameName}`);
      return;
    }
    gameService.sendMessage(GameActions.CREATE_GAME, GameType.MULTI);
    const sub = gameService.listenGameUpdate()
      .subscribe((data: any) => {
      const gameId = typeof data === 'string' ? data : data?.gameId;

      if (gameId) {
        if (gameService instanceof GameService) {
          gameService.setGameId(gameId);
        }
      } else {
        console.error("Erreur : ID de la partie non reçu.", data);
      }

      sub.unsubscribe();
    });

    this.showModalEvent.emit(gameService);
  }
}
