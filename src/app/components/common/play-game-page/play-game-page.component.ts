import {Directive, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import { Card } from "../../../model/dto/request/card";
import { GameActions } from "../../../model/enum/game.actions.enum";
import { NzMessageService } from "ng-zorro-antd/message";
import { ActivatedRoute, Router } from "@angular/router";
import { GameType } from "../../../model/enum/game-type.enum";
import {GameService} from "../../../services/games/game.service";
import {ActionDescriptor} from "./action-descriptor";

@Directive()
export abstract class PlayGamePage implements OnInit, OnDestroy {
  protected gameAction: Record<string, string | number> = GameActions;

  protected isActionDisabled: WritableSignal<boolean> = signal(false);

  protected isChatVisible: WritableSignal<boolean> = signal(false);

  public isLeaveModalVisible: WritableSignal<boolean> = signal(false);

  public isWaitingRoomModalVisible: WritableSignal<boolean> = signal(false);

  public errorWaitingRoom: WritableSignal<string> = signal("");

  protected gameType: string = "";

  protected readonly GameType = GameType;

  public playerNames: WritableSignal<any[]> = signal([]);

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

  protected actions: ActionDescriptor[] = [];
  protected secondaryActions: ActionDescriptor[] = [];

  protected gameId: string | null = null; // Stocke l'ID de la partie

  protected constructor(
    protected gameService: GameService,
    protected message: NzMessageService,
    protected readonly router: Router,
    protected readonly route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.gameType = params['gameType']?.toUpperCase();
    });
  }

  ngOnInit(): void {
    this.createGame();
    this.listenForGameUpdates();
    this.listenForPlayerUpdates();
    this.listenForEndGame();
  }

  ngOnDestroy(): void {
    this.gameService.sendMessage(GameActions.END_GAME, this.gameId);
  }

  protected createGame(): void {
    this.gameId = this.gameService.getGameId();

    if (this.gameId === null) {
      const createGameSubscription = this.gameService.listenGameUpdate()
        .subscribe((data: any) => {

          if (typeof data === 'string') {
            console.warn("⚠️ ID reçu comme string brut :", data);
            this.gameService.setGameId(data);
          } else if (data?.gameId) {
            this.gameService.setGameId(data.gameId);
          } else {
            console.error("Erreur : ID de la partie non reçu.", data);
            return;
          }
          createGameSubscription.unsubscribe();
        });

      this.gameService.sendMessage(GameActions.CREATE_GAME);
    } else {
      this.gameFound();
    }
  }

  protected abstract gameFound(): void;

  protected listenForGameUpdates(): void {
    this.gameService.listenGameUpdate()
      .subscribe((data: any) => {
        console.log(data)
        if (data?.gameId && !this.gameId) {
          this.gameId = data.gameId;
        }

        if (data?.dealerHand) {
          this.hands.dealerHand = data.dealerHand;
        }

        if (data.game?._dealerHand) {
          this.hands.dealerHand = data.game._dealerHand;
        }

        this.gameService.setPlayers(data.players);

        if (data?.players?.length > 0) {
          this.playerNames.set(data.players.map((p: any) => p.playerId));
          const player = data.players.find((p: { playerId: string; }) =>
            p.playerId === this.gameService.getPlayerId());
          if (player) {
            this.updatePlayerInfos(player);
          }
        }

        this.isActionDisabled.set(false);
      });
  }


  protected listenForPlayerUpdates(): void {
    this.gameService.listenPlayerUpdate()
      .subscribe((player: any) => {
        this.updatePlayerInfos(player);
      });
  }


  protected listenForEndGame(): void {
    this.gameService.listenEndGame()
      .subscribe(async () => {
        this.isActionDisabled.set(true);
        await this.sleep(3000);

        console.log('listenForEndGame play-game-page');
        // 2. Réaffiche la WaitingRoomModal
        this.showWaitingRoomModal();

        // 3. Réinitialisation partielle si besoin
        this.isActionDisabled.set(true);
      });
  }

  protected updatePlayerInfos(player: any): void {
    if (!player) {
      console.warn("Aucun joueur trouvé !");
      return;
    }
    if (!player.currentHandId) {
      this.hands.selfHand = player.hand[0];
    } else {
      this.hands.selfHand = player.hand[player.currentHandId];
    }
  }

  executeAction(action: string): void {
    if (!this.gameId) {
      console.warn("Impossible d'envoyer l'action, gameId manquant !");
      return;
    }

    this.isActionDisabled.set(true);

    this.gameService.sendMessage(GameActions.ACTION, { action: action, gameId: this.gameId });

    this.isActionDisabled.set(false);
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

  public showWaitingRoomModal(): void {
    this.isWaitingRoomModalVisible.set(true);
  }

  handleWaitingRoomConfirm(): void {
    if (!this.gameType) {
      console.warn("Type de jeu manquant !");
      return;
    }

    this.isWaitingRoomModalVisible.set(false);
    this.gameService.sendMessage(GameActions.RESTART_GAME, {
      type: this.gameType
    });
  }

  handleWaitingRoomLeave() {
    this.gameService.sendMessage(GameActions.QUIT_GAME)
    this.isWaitingRoomModalVisible.set(false);
    this.router.navigateByUrl("/games");
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
