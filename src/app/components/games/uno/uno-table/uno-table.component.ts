import {Component, effect, inject, signal} from '@angular/core';
import {UnoHandComponent} from "../uno-hand/uno-hand.component";
import {UnoCardComponent} from "../uno-card/uno-card.component";
import {UnoCardBackComponent} from "../uno-card-back/uno-card-back.component";
import {UnoBackHandComponent} from "../uno-back-hand/uno-back-hand.component";
import {UnoService} from "../../../../services/uno.service";
import {ActivatedRoute} from "@angular/router";
import {UserAuthService} from "../../../../services/auth/user-auth.service";
import {GameActions} from "../../../../model/enum/game.actions.enum";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {UnoAction, UnoActionType} from "../../../../model/dto/uno/uno-actions.interface";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {Clipboard} from '@angular/cdk/clipboard';
import {NgOptimizedImage, NgStyle} from "@angular/common";
import {UnoPlayer} from "../../../../model/dto/uno/uno-game.interface";
import {DirectionWheelComponent} from "../direction-wheel/direction-wheel.component";

@Component({
  selector: 'app-uno-table',
  imports: [
    UnoHandComponent,
    UnoCardComponent,
    UnoCardBackComponent,
    UnoBackHandComponent,
    NzBadgeComponent,
    NzIconDirective,
    NgStyle,
    NgOptimizedImage,
    DirectionWheelComponent
  ],
  templateUrl: './uno-table.component.html',
  standalone: true,
  styleUrl: './uno-table.component.scss'
})
export class UnoTableComponent {


  protected readonly unoService : UnoService = inject(UnoService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly userAuthService: UserAuthService = inject(UserAuthService);
  protected username : string = this.userAuthService.user().pseudo;
  // current player id

  orderedPlayers = signal<UnoPlayer[]>([]);

  protected readonly gameType = this.route.snapshot.queryParams['gameType'];

  protected readonly clipBoard: Clipboard = inject(Clipboard);

  constructor() {
    if(this.gameType === 'solo') {
      console.log('game type is solo');
      this.unoService.sendMessage(GameActions.CREATE_GAME, {
        playerName: this.username,
        mode: this.gameType.toUpperCase(),
        avatar: this.userAuthService.user().avatar
      })
    }
    effect(() => {
      this.orderedPlayers.set(this.unoService.getOrderedPlayers());
    });
  }

  drawCard() {
    console.log('Draw card action triggered');
    if((this.unoService.isPlayerTurn())) {
      const unoAction: UnoAction = {
        roomId: this.unoService.getGameId(),
        type: UnoActionType.DRAW_CARD,
        card: undefined,
        playerId: this.unoService.getPlayerId()
      }
      this.unoService.sendMessage('ACTION', unoAction)
      console.log('Draw card action sent:', unoAction);
    }
  }

  isPlayerTurn(playerId: string) : boolean {
    return this.unoService.unoGameState().currentTurnPlayerId  === playerId;
  }

  protected copyGameId(): void {
    const gameId = this.unoService.getGameId();
    if (gameId) {
      this.clipBoard.copy(gameId);
    }
  }

}
