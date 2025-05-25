import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {BlackjackService} from "../../services/games/blackjack.service";
import {Card} from "../../model/dto/request/card";
import {GameActions} from "../../model/enum/game.actions.enum";
import {BlackJackActions} from "../../model/enum/black-jack.actions.enum";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {ChatComponent} from "../../components/games/chat/chat.component";
import {HeaderComponent} from "../../components/common/header/header.component";
import {RankingComponent} from "../../components/pages/game-page/ranking/ranking.component";
import {GameTableComponent} from "../../components/games/game-table/game-table.component";
import {NzModalComponent, NzModalModule} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {GameType} from "../../model/enum/game-type.enum";
import {WaitingRoomModalComponent} from "../../components/common/waiting-room-modal/waiting-room-modal.component";

@Component({
  selector: 'app-blackjack-page',
  imports: [
    NgOptimizedImage,
    NzButtonComponent,
    NzIconDirective,
    NzBadgeComponent,
    NzDividerComponent,
    ChatComponent,
    HeaderComponent,
    RankingComponent,
    GameTableComponent,
    NzModalComponent,
    NzModalModule,
    WaitingRoomModalComponent
  ],
  templateUrl: './blackjack-page.component.html',
  styleUrl: './blackjack-page.component.scss'
})
export class BlackjackPageComponent implements OnInit {
  protected BlackJackAction: typeof BlackJackActions = BlackJackActions;

  protected isActionDisabled: boolean = false;

  protected isChatVisible: WritableSignal<boolean> = signal(false);

  public isLeaveModalVisible: WritableSignal<boolean> = signal(false);

  public isWaitingRoomModalVisible: WritableSignal<boolean> = signal(false);

  protected gameType: GameType | undefined;

  protected readonly GameType = GameType;

  protected playerBalance: number = 1000;

  protected playerBet: number = 0; // Mise actuelle du joueur

  public playerNames: string[] = [];

  protected hands: {
    player1Hand: Card[],
    player2Hand: Card[],
    player3Hand: Card[],
    dealerHand: Card[],
    selfHand: Card[]
  } = {
    player1Hand: [
      { rank: 'back', suit: '', value: 0 },
      { rank: 'back', suit: '', value: 0 },
    ],
    player2Hand: [
      { rank: 'back', suit: '', value: 0 },
      { rank: 'back', suit: '', value: 0 },
    ],
    player3Hand: [
      { rank: 'back', suit: '', value: 0 },
      { rank: 'back', suit: '', value: 0 },
    ],
    selfHand: [
    ],
    dealerHand: [
    ],
  };

  protected gameId: string | null = null; // Stocke l'ID de la partie

  constructor(
    private blackJackService: BlackjackService,
    private message: NzMessageService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.gameType = params['gameType']?.toUpperCase();
    });
  }

  ngOnInit(): void {
    this.createAndStartGame();
    this.listenForGameUpdates();
    this.listenForPlayerUpdates();
    this.listenForEndGame();
  }

  ngOnDestroy(): void {
    this.blackJackService.sendMessage(GameActions.END_GAME, this.gameId);
    // Déconnexion du WebSocket
    this.blackJackService.disconnect();
  }

  private createAndStartGame(): void {
    this.gameId = this.blackJackService.getGameId();

    if (this.gameId === null) {
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

          this.blackJackService.sendMessage(GameActions.START_GAME, { type: this.gameType, bet: this.playerBalance });

          createGameSubscription.unsubscribe();
        });

      this.blackJackService.sendMessage(GameActions.CREATE_GAME, this.gameType);
    } else {
      // Si on a déjà l’ID, on peut démarrer directement
      this.blackJackService.sendMessage(GameActions.START_GAME, { type: this.gameType, bet: this.playerBalance });
    }
  }

  private listenForGameUpdates(): void {
    this.blackJackService.listenGameUpdate()
      .subscribe((data: any) => {
        console.log("Game update received:", data);

        if (data?.gameId && !this.gameId) {
          this.gameId = data.gameId;
        }

        if (data?.dealerHand) {
          this.hands.dealerHand = data.dealerHand;
        }

        this.blackJackService.setPlayers(data.players);

        if (data?.players?.length > 0) {
          this.playerNames = data.players.map((p: any) => p.playerId);
          const player = data.players.find((p: { playerId: string; }) =>
            p.playerId === this.blackJackService.getPlayerId());
          if (player) {
            this.updatePlayerInfos(player);
          }
        }

        this.isActionDisabled = false;
      });
  }


  private listenForPlayerUpdates(): void {
    this.blackJackService.listenPlayerUpdate()
      .subscribe((player: any) => {
        console.log("Player update received:", player);
        this.updatePlayerInfos(player);
      });
  }


  private listenForEndGame(): void {
    this.blackJackService.listenEndGame()
      .subscribe((data: any) => {
        console.log('🎯 FIN DE PARTIE');
        if (data.player) {
          let diff = data.player.balance - data.player.bet;
          if (diff > 0) {
            console.log('You won ', diff);
          } else {
            console.log('You lost ', diff);
          }
        }

        // 2. Réaffiche la WaitingRoomModal
        this.showWaitingRoomModal();

        // 3. Réinitialisation partielle si besoin
        this.isActionDisabled = true;
      });
  }

  private updatePlayerInfos(player: any): void {
    if (!player) {
      console.warn("Aucun joueur trouvé !");
      return;
    }
    if (!player.currentHandId) {
      this.hands.selfHand = player.hand[0];
    } else {
      this.hands.selfHand = player.hand[player.currentHandId];
    }
    this.playerBalance  = player.balance;
  }

  executeAction(action: BlackJackActions): void {
    if (!this.gameId) {
      console.warn("Impossible d'envoyer l'action, gameId manquant !");
      return;
    }

    this.isActionDisabled = true;

    this.blackJackService.sendMessage(GameActions.ACTION, { action: action, gameId: this.gameId });

    this.isActionDisabled = false;
  }

  open(): void {
    this.isChatVisible.set(true);
  }

  handleCancelMiddle(): void {
    this.isLeaveModalVisible.set(false);
  }

  handleOkMiddle(): void {
    this.isLeaveModalVisible.set(false);
    this.router.navigateByUrl("/games");
  }

  placeBet(amount: number): void {
    if (this.playerBalance >= amount) {
      this.playerBet += amount;
      this.playerBalance -= amount;
      console.log(`Mise: ${this.playerBet}, Balance restante: ${this.playerBalance}`);
    } else {
      console.warn("Solde insuffisant pour cette mise !");
    }
  }

  public showWaitingRoomModal(): void {
    this.isWaitingRoomModalVisible.set(true);
  }

  handleWaitingRoomConfirm(bet: number): void {
    if (!this.gameType) {
      console.warn("Type de jeu manquant !");
      return;
    }

    this.playerBet = bet;
    this.playerBalance -= bet;

    console.log(`🎮 Rejouer avec mise : ${bet}, solde restant : ${this.playerBalance}`);

    this.isWaitingRoomModalVisible.set(false);
    this.blackJackService.sendMessage(GameActions.RESTART_GAME, {
      type: this.gameType,
      bet: bet
    });
  }

  handleWaitingRoomLeave($event: void) {
    this.isWaitingRoomModalVisible.set(false);
    this.router.navigateByUrl("/games");
  }
}
