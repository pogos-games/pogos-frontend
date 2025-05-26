import {Component, signal, WritableSignal} from '@angular/core';
import {BlackjackService} from "../../services/games/blackjack.service";
import { GameActions } from "../../model/enum/game.actions.enum";
import { BlackJackActions } from "../../model/enum/black-jack.actions.enum";
import { NzMessageService } from "ng-zorro-antd/message";
import { ChatComponent } from "../../components/games/chat/chat.component";
import { HeaderComponent } from "../../components/common/header/header.component";
import { RankingComponent } from "../../components/pages/game-page/ranking/ranking.component";
import { GameTableComponent } from "../../components/games/game-table/game-table.component";
import { NzModalComponent, NzModalModule } from "ng-zorro-antd/modal";
import { ActivatedRoute, Router } from "@angular/router";
import {WaitingRoomModalComponent} from "../../components/common/waiting-room-modal/waiting-room-modal.component";
import {PlayGamePage} from "../../components/common/play-game-page/play-game-page.component";
import {ActionDescriptor} from "../../components/common/play-game-page/action-descriptor";
import {ActionRowComponent} from "../../components/common/actions-row/action-row.component";

@Component({
  selector: 'app-blackjack-page',
  imports: [
    ChatComponent,
    HeaderComponent,
    RankingComponent,
    GameTableComponent,
    NzModalComponent,
    NzModalModule,
    WaitingRoomModalComponent,
    ActionRowComponent
  ],
  templateUrl: './blackjack-page.component.html',
  standalone: true,
  styleUrl: './blackjack-page.component.scss'
})
export class BlackjackPageComponent extends PlayGamePage {
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
    message: NzMessageService,
    router: Router,
    route: ActivatedRoute
  ) {
    super(gameService, message, router, route)
  }

  protected override gameFound(): void{
    this.gameService.sendMessage(GameActions.START_GAME, { type: this.gameType, bet: this.playerBalance });
  }

  protected override updatePlayerInfos(player: any): void {
    super.updatePlayerInfos(player)
    this.playerBalance  = player.balance;
  }

  handleWaitingRoomConfirmClick(bet: number): void {
    this.handleWaitingRoomConfirm();

    this.playerBet.set(bet);
    this.playerBalance -= bet;

    console.log(`🎮 Rejouer avec mise : ${bet}, solde restant : ${this.playerBalance}`);
  }
}
