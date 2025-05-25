import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {BlackjackService} from "../../../../services/games/blackjack.service";
import {GameActions} from "../../../../model/enum/game.actions.enum";
import {GameType} from "../../../../model/enum/game-type.enum";

@Component({
  selector: 'app-game-buttons',
  imports: [
    NzButtonComponent,
    RouterLink,
    NzColDirective,
    NzRowDirective
  ],
  templateUrl: './game-buttons.component.html',
  styleUrl: './game-buttons.component.scss'
})
export class GameButtonsComponent {

  @Output() showModalEvent = new EventEmitter<void>();

  @Input({required:true}) title: string = 'Blackjack';

  private readonly blackJackService: BlackjackService = inject(BlackjackService)

  protected showModal() {
    switch (this.title) {
      case 'Blackjack':
        this.blackJackService.sendMessage(GameActions.CREATE_GAME, GameType.MULTI);
        const createGameSubscription = this.blackJackService.listenGameUpdate()
          .subscribe((data: any) => {
            if (typeof data === 'string') {
              console.warn("⚠️ ID reçu comme string brut :", data);
              this.blackJackService.setGameId(data);
            } else if (data?.gameId) {
              this.blackJackService.setGameId(data.gameId);
            } else {
              console.error("Erreur : ID de la partie non reçu.", data);
              return;
            }

            createGameSubscription.unsubscribe();
          });
    }
    this.showModalEvent.emit();
  }

}
