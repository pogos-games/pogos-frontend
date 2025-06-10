import {Component, signal, WritableSignal} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import { HeaderComponent } from '../../components/common/header/header.component';
import { RankingComponent } from '../../components/pages/game-page/ranking/ranking.component';
import { GameTablePokerComponent } from '../../components/games/game-table/game-table-poker/game-table-poker.component';
import { NzModalComponent, NzModalModule } from "ng-zorro-antd/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { PokerActions } from '../../model/enum/poker.actions.enum';
import { PokerService } from '../../services/games/poker.service';
import {PlayGamePage} from "../../components/common/play-game-page/play-game-page.component";
import {ActionRowComponent} from "../../components/common/actions-row/action-row.component";
import {ActionDescriptor} from "../../components/common/play-game-page/action-descriptor";
import {WaitingRoomModalComponent} from "../../components/common/waiting-room-modal/waiting-room-modal.component";
import {GameActions} from "../../model/enum/game.actions.enum";

@Component({
  selector: 'app-poker-page',
  standalone: true,
  imports: [
    HeaderComponent,
    RankingComponent,
    GameTablePokerComponent,
    NzModalComponent,
    NzModalModule,
    ActionRowComponent,
    WaitingRoomModalComponent,
  ],
  templateUrl: './poker-page.component.html',
  styleUrl: './poker-page.component.scss'
})
export class PokerPageComponent extends PlayGamePage {

  protected override gameAction: typeof PokerActions = PokerActions;

  protected isSecondaryActionsDisabled: WritableSignal<boolean> = signal(false);

  protected currentPotAmount: Number = 0;

  protected playerBalance: number = 1000;

  protected playerBet: WritableSignal<number> = signal(-10); // Mise actuelle du joueur

  isPotEmpty = false;

  override actions = [
    new ActionDescriptor("Miser", "check", PokerActions.BET, this.isPotEmpty),
    new ActionDescriptor("Suivre", "check", PokerActions.CALL, !this.isPotEmpty),
    new ActionDescriptor("Relancer", "check", PokerActions.RAISE, !this.isPotEmpty)
  ]

  override secondaryActions = [
    new ActionDescriptor("Check", "check", PokerActions.CHECK),
    new ActionDescriptor("All In", "check", PokerActions.ALL_IN),
    new ActionDescriptor("Se coucher", "check", PokerActions.FOLD)
  ]

  constructor(pokerService:PokerService, message:NzMessageService, router:Router, route:ActivatedRoute) {
    super(pokerService,message,router,route);
  }

  protected readonly PokerActions = PokerActions;

  placeBet(bet: number){
    this.playerBet.set(bet);
  }

  override executeAction(action: string): void {
    if (!this.gameId) {
      console.warn("Impossible d'envoyer l'action, gameId manquant !");
      return;
    }

    this.isActionDisabled.set(true);
    this.isSecondaryActionsDisabled.set(true)

    this.gameService.sendMessage(GameActions.ACTION, { action: action, bet:this.playerBet, gameId: this.gameId });
    this.playerBet.set(0);
  }

  protected gameFound() {
    console.log("game found")
  }

  protected override setActionDisabled(data: any){
      this.isActionDisabled.set(this.gameService.getPlayerId() != data.nextPlayerId)
      this.isSecondaryActionsDisabled.set(this.gameService.getPlayerId() != data.nextPlayerId)
  }

  protected override updatePlayerInfos(player: any): void {
    this.hands.selfHand = player.hand;
    this.playerBet.set(player.bet)
    this.playerBalance = player.balance;
  }

  handleWaitingRoomConfirmClick(bet: number): void {
    this.handleWaitingRoomConfirm();

    this.playerBet.set(bet);
    this.playerBalance -= bet;

    console.log(`🎮 Rejouer avec mise : ${bet}, solde restant : ${this.playerBalance}`);
  }
}
