import {Component, signal, WritableSignal} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {HeaderComponent} from '../../components/common/header/header.component';
import {GameTablePokerComponent} from '../../components/games/game-table/game-table-poker/game-table-poker.component';
import {NzModalComponent, NzModalModule} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {PokerActions} from '../../model/dto/poker/enum/poker.actions.enum';
import {PokerService} from '../../services/games/poker.service';
import {PlayGamePage} from "../../components/common/play-game-page/play-game-page.component";
import {ActionRowComponent} from "../../components/common/actions-row/action-row.component";
import {ActionDescriptor} from "../../components/common/play-game-page/action-descriptor";
import {WaitingRoomModalComponent} from "../../components/common/waiting-room-modal/waiting-room-modal.component";
import {GameActions} from "../../model/dto/game/enum/gateway/game.actions.enum";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../services/config.service";
import {UserAuthService} from "../../services/auth/user-auth.service";
import {PokerPlayer} from "../../model/dto/poker/poker-player.interface";
import {PokerResponse} from "../../model/dto/poker/response/poker-response.interface";
import {PokerPlayerResponse} from "../../model/dto/poker/response/poker-player-response.interface";
import {ChatComponent} from "../../components/games/chat/chat.component";
import {Card} from "../../model/dto/game/card.interface";

@Component({
  selector: 'app-poker-page',
  standalone: true,
    imports: [
        HeaderComponent,
        GameTablePokerComponent,
        NzModalComponent,
        NzModalModule,
        ActionRowComponent,
        WaitingRoomModalComponent,
        ChatComponent,
    ],
  templateUrl: './poker-page.component.html',
  styleUrl: './poker-page.component.scss'
})
export class PokerPageComponent extends PlayGamePage<PokerService,PokerResponse,PokerPlayer,PokerPlayerResponse,Card> {
  river = signal<Card[]>([])
  currentPlayerId = signal<string>("")
  orderedPlayers = signal<PokerPlayer[]>([]);
  playerCards = signal<Card[]>([])
  playerId = signal<string>("")
  totalPot = signal<number>(0)

  protected override gameAction: typeof PokerActions = PokerActions;

  protected isSecondaryActionsDisabled: WritableSignal<boolean> = signal(false);

  protected currentPotAmount = signal(0);

  protected playerBet: WritableSignal<number> = signal(-10); // Mise actuelle du joueur
  protected playerBalance: WritableSignal<number> = signal(-10); // Mise actuelle du joueur

  isPotEmpty: WritableSignal<boolean> = signal(false);

  override actions = [
    new ActionDescriptor("Miser", "check", PokerActions.BET, this.isPotEmpty()),
    new ActionDescriptor("Suivre", "check", PokerActions.CALL, !this.isPotEmpty()),
    new ActionDescriptor("Relancer", "check", PokerActions.RAISE, !this.isPotEmpty())
  ]

  override secondaryActions = [
    new ActionDescriptor("Check", "check", PokerActions.CHECK),
    new ActionDescriptor("All In", "check", PokerActions.ALL_IN),
    new ActionDescriptor("Se coucher", "check", PokerActions.FOLD)
  ]

  constructor(configService: ConfigService, pokerService:PokerService, message:NzMessageService, router:Router, route:ActivatedRoute, http: HttpClient, userAuthService: UserAuthService) {
    super(http,configService,pokerService,message,router,route, userAuthService);
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

  protected override setActionDisabled(data : any){
      this.isActionDisabled.set(this.gameService.getPlayerId() != data.nextPlayerId)
      this.isSecondaryActionsDisabled.set(this.gameService.getPlayerId() != data.nextPlayerId)
  }

  protected override updatePlayerInfos(player: PokerPlayerResponse): void {
    this.hands.selfHand = player.hand;
    this.playerBet.set(player.bet)
    this.playerBalance.set(player.balance);
  }

  handleWaitingRoomConfirmClick(bet: number): void {
    this.handleWaitingRoomConfirm();
    this.playerBet.set(bet);
  }


  protected override updateGameInfo(data: PokerResponse) {
    super.updateGameInfo(data);
    const player = data.players.find((p) => p.playerId == this.gameService.getPlayerId())
    this.isPotEmpty.set(data.roundPot == 0)
    this.totalPot.set(data.pot)
    this.river.set(data.dealerHand)
    this.currentPlayerId.set(data.nextPlayerId)
    this.playerCards.set(player?.hand ?? [])
    this.playerBet.set(player?.bet ?? 0)
    this.playerBalance.set(player?.balance ?? 0)
    this.playerId.set(this.gameService.getPlayerId())
    const playerIndex = data.players.findIndex(p => p.playerId === this.playerId());

    if (playerIndex !== -1) {
      const rotated = [...data.players.slice(playerIndex), ...data.players.slice(0, playerIndex)];
      this.orderedPlayers.set(rotated.map((player: PokerPlayerResponse) => (player) as PokerPlayer));
    } else {
      this.orderedPlayers.set(data.players.map((player: PokerPlayerResponse) => (player) as PokerPlayer))
    }

    this.gameService.playersList.set(data.players.map((p) => (p as PokerPlayer)))
  }
}
