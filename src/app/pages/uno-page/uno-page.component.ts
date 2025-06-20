import {Component, signal, WritableSignal} from '@angular/core';
import {HeaderComponent} from "../../components/common/header/header.component";
import {UnoTableComponent} from "../../components/games/uno/uno-table/uno-table.component";
import {UnoService} from "../../services/uno.service";
import {ChatComponent} from "../../components/games/chat/chat.component";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfigService} from "../../services/config.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {HttpClient} from "@angular/common/http";
import {PlayGamePage} from "../../components/common/play-game-page/play-game-page.component";
import {WaitingRoomModalComponent} from "../../components/common/waiting-room-modal/waiting-room-modal.component";
import {UserAuthService} from "../../services/auth/user-auth.service";
import {GameActions} from "../../model/dto/game/enum/gateway/game.actions.enum";
import {UnoResponse} from "../../model/dto/uno/dto/response/uno-response.interface";
import {UnoPlayer} from "../../model/dto/uno/entities/uno-player.interface";
import {UnoPlayerResponse} from "../../model/dto/uno/dto/response/uno-player-response.interface";
import {UnoCard, UnoCardColor, UnoCardType} from "../../model/dto/uno/entities/uno-card.interface";
import {UnoGameDirection} from "../../model/dto/uno/enum/uno-game-direction.enum";
import {UnoActionType} from "../../model/dto/uno/enum/uno-action.enum";

@Component({
  selector: 'app-uno-page',
  imports: [
    HeaderComponent,
    UnoTableComponent,
    ChatComponent,
    NzDividerComponent,
    NzModalComponent,
    NzModalContentDirective,
    WaitingRoomModalComponent
  ],
  templateUrl: './uno-page.component.html',
  standalone: true,
  styleUrl: './uno-page.component.scss'
})
export class UnoPageComponent extends PlayGamePage<UnoService,UnoResponse,UnoPlayer,UnoPlayerResponse,UnoCard>{

  protected playerBet: WritableSignal<number> = signal(-10);

  currentPlayerId = signal<string>("")
  orderedPlayers = signal<UnoPlayer[]>([]);
  topCard = signal<UnoCard>({color: UnoCardColor.RED, type: UnoCardType.NUMBER} as UnoCard)
  direction= signal<UnoGameDirection>(UnoGameDirection.CLOCKWISE);
  playerCards = signal<UnoCard[]>([])
  playerId = signal<string>("")
  constructor(configService: ConfigService, unoService:UnoService, message:NzMessageService, router:Router, route:ActivatedRoute, http: HttpClient,userAuthService: UserAuthService) {
    super(http,configService,unoService,message,router,route,userAuthService);
  }

  protected gameFound() {
  }



  drawCard(): void {
    if (this.gameId == "") {
      console.warn("Impossible d'envoyer l'action, gameId manquant !");
      return;
    }
    this.gameService.sendMessage(GameActions.ACTION, { action: UnoActionType.DRAW_CARD, gameId: this.gameId });
  }

  playCard(card: UnoCard){
    if (this.gameId == "") {
      console.warn("Impossible d'envoyer l'action, gameId manquant !");
      return;
    }
    this.gameService.sendMessage(GameActions.ACTION, { action: UnoActionType.PLAY_CARD, gameId: this.gameId, card: card });
  }
  protected override updateGameInfo(data: UnoResponse) {
    super.updateGameInfo(data);
    this.currentPlayerId.set(data.currentTurnPlayerId)
    this.topCard.set(data.discardPile.at(-1)!)
    this.direction.set(data.direction)
    this.orderedPlayers.set(
      data.players.map((player: UnoPlayerResponse) => (player) as UnoPlayer)
    );
  }

  protected override updatePlayerInfos(player: any): void {
    const colorOrder: Record<UnoCardColor, number> = {
      [UnoCardColor.RED]: 0,
      [UnoCardColor.YELLOW]: 1,
      [UnoCardColor.GREEN]: 2,
      [UnoCardColor.BLUE]: 3,
      [UnoCardColor.WILD]: 4
    };
    this.playerId.set(player.playerId)
    this.playerCards.set(
      player.hand.map((card: UnoCard) => (card)).sort((a: UnoCard, b:UnoCard) => colorOrder[a.color] - colorOrder[b.color])
    )
  }

  handleWaitingRoomConfirmClick(bet: number): void {
    this.handleWaitingRoomConfirm();
    this.playerBet.set(bet);
  }
}
