import { Component, signal, WritableSignal } from '@angular/core';
import { BlackjackService } from "../../services/games/blackjack.service";
import { GameActions } from "../../model/dto/game/enum/gateway/game.actions.enum";
import { BlackJackActions } from "../../model/dto/blackjack/enum/black-jack.actions.enum";
import { NzMessageService } from "ng-zorro-antd/message";
import { HeaderComponent } from "../../components/common/header/header.component";
import { GameTableBlackjackComponent } from "../../components/games/game-table/game-table-blackjack/game-table-blackjack.component";
import { NzModalComponent, NzModalModule } from "ng-zorro-antd/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { WaitingRoomModalComponent } from "../../components/common/waiting-room-modal/waiting-room-modal.component";
import { PlayGamePage } from "../../components/common/play-game-page/play-game-page.component";
import { ActionDescriptor } from "../../components/common/play-game-page/action-descriptor";
import { ActionRowComponent } from "../../components/common/actions-row/action-row.component";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../services/config.service";
import {UserAuthService} from "../../services/auth/user-auth.service";
import {BlackJackResponse} from "../../model/dto/blackjack/response/blackjack-response.interface";
import {BlackJackPlayerResponse} from "../../model/dto/blackjack/response/blackjack-player-response.interface";
import {BlackJackPlayer} from "../../model/dto/blackjack/blackjack-player.interface";
import {ChatComponent} from "../../components/games/chat/chat.component";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {Card} from "../../model/dto/game/card.interface";

@Component({
  selector: 'app-blackjack-page',
  imports: [
    HeaderComponent,
    GameTableBlackjackComponent,
    NzModalComponent,
    NzModalModule,
    WaitingRoomModalComponent,
    ActionRowComponent,
    ChatComponent,
    NzDividerComponent
  ],
  templateUrl: './blackjack-page.component.html',
  standalone: true,
  styleUrl: './blackjack-page.component.scss'
})
export class BlackjackPageComponent extends PlayGamePage<BlackjackService,BlackJackResponse,BlackJackPlayer,BlackJackPlayerResponse,Card> {
  protected override gameAction: typeof BlackJackActions = BlackJackActions;

  protected playerBalance: number = 1000;

  protected playerBet: WritableSignal<number> = signal(0); // Mise actuelle du joueur

  override actions: ActionDescriptor[] = [
    new ActionDescriptor("Hit", "double-right", BlackJackActions.HIT),
    new ActionDescriptor("Stand", "double-right", BlackJackActions.STAND),
  ]

  override secondaryActions: ActionDescriptor[] = [
    new ActionDescriptor("Miser double", "double-right", BlackJackActions.DOUBLE_DOWN),
    new ActionDescriptor("Split", "double-left", BlackJackActions.SPLIT),
  ]
  constructor(
    gameService: BlackjackService,
    configService: ConfigService,
    message: NzMessageService,
    router: Router,
    route: ActivatedRoute,
    http: HttpClient,
    userAuthService: UserAuthService
  ) {
    super(http,configService,gameService, message, router, route, userAuthService)
  }

  protected override gameFound(): void {
    this.gameService.sendMessage(GameActions.START_GAME, { mode: this.gameMode, bet: this.playerBalance });
  }

  protected override updatePlayerInfos(player: any): void {
    super.updatePlayerInfos(player)
    this.playerBalance = player.balance;
  }

  handleWaitingRoomConfirmClick(bet: number): void {
    this.handleWaitingRoomConfirm();

    this.playerBet.set(bet);
    this.playerBalance -= bet;

    console.log(`🎮 Rejouer avec mise : ${bet}, solde restant : ${this.playerBalance}`);
  }

  protected override updateGameInfo(data: BlackJackResponse) {
    super.updateGameInfo(data);

    if (data?.dealerHand) {
      this.hands.dealerHand = data.dealerHand;
    }

    this.gameService.playersList.set(data.players.map((p) => (p as BlackJackPlayer)))
  }
}
