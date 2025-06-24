import {Component, signal, WritableSignal} from '@angular/core';
import {BlackjackService} from "../../services/games/blackjack.service";
import {GameActions} from "../../model/dto/game/enum/gateway/game.actions.enum";
import {BlackJackActions} from "../../model/dto/blackjack/enum/black-jack.actions.enum";
import {NzMessageService} from "ng-zorro-antd/message";
import {HeaderComponent} from "../../components/common/header/header.component";
import {
  GameTableBlackjackComponent
} from "../../components/games/game-table/game-table-blackjack/game-table-blackjack.component";
import {NzModalComponent, NzModalModule} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {WaitingRoomModalComponent} from "../../components/common/waiting-room-modal/waiting-room-modal.component";
import {PlayGamePage} from "../../components/common/play-game-page/play-game-page.component";
import {ActionDescriptor} from "../../components/common/play-game-page/action-descriptor";
import {ActionRowComponent} from "../../components/common/actions-row/action-row.component";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../services/config.service";
import {UserAuthService} from "../../services/auth/user-auth.service";
import {BlackJackResponse} from "../../model/dto/blackjack/response/blackjack-response.interface";
import {BlackJackPlayerResponse} from "../../model/dto/blackjack/response/blackjack-player-response.interface";
import {BlackJackPlayer} from "../../model/dto/blackjack/blackjack-player.interface";
import {ChatComponent} from "../../components/games/chat/chat.component";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {Card} from "../../model/dto/game/card.interface";
import {
  GameResult,
  GameResultModalComponent
} from "../../components/common/game-result-modal/game-result-modal.component";
import {NzNotificationService} from "ng-zorro-antd/notification";

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
    NzDividerComponent,
    GameResultModalComponent
  ],
  templateUrl: './blackjack-page.component.html',
  standalone: true,
  styleUrl: './blackjack-page.component.scss'
})
export class BlackjackPageComponent extends PlayGamePage<BlackjackService,BlackJackResponse,BlackJackPlayer,BlackJackPlayerResponse,Card> {
  protected override gameAction: typeof BlackJackActions = BlackJackActions;

  protected playerBalance: number = 1000;

  protected playerBet: WritableSignal<number> = signal(0); // Mise actuelle du joueur

  // Nouveau: Modal de résultat de partie
  protected isGameResultModalVisible: WritableSignal<boolean> = signal(false);
  protected gameResult: GameResult | null = null;

  override actions: ActionDescriptor[] = [
    new ActionDescriptor("Hit", "double-right", BlackJackActions.HIT),
    new ActionDescriptor("Stand", "double-right", BlackJackActions.STAND),
  ]

  override secondaryActions: ActionDescriptor[] = [
    new ActionDescriptor("Miser double", "double-right", BlackJackActions.DOUBLE_DOWN),
    new ActionDescriptor("Split", "double-left", BlackJackActions.SPLIT),
  ]
  // Nouveau: pour suivre l'état de la partie
  protected gameEnded: WritableSignal<boolean> = signal(false);

  constructor(
    gameService: BlackjackService,
    configService: ConfigService,
    message: NzMessageService,
    router: Router,
    route: ActivatedRoute,
    http: HttpClient,
    userAuthService: UserAuthService,
    nzNotificationService: NzNotificationService
  ) {
    super(http,configService,gameService, message, router, route, userAuthService,nzNotificationService)
  }

  protected override gameFound(): void {
    this.gameService.sendMessage(GameActions.START_GAME, { mode: this.gameMode, bet: this.playerBalance });
  }

  protected override updatePlayerInfos(player: any): void {
    super.updatePlayerInfos(player)
    this.playerBalance = player.balance;
  }

  protected override listenForEndGame(): void {
    this.gameService.listenEndGame()
      .subscribe(async (endGameData: any) => {
        this.isActionDisabled.set(true);

        // Marquer la partie comme terminée pour révéler les cartes du croupier
        this.gameEnded.set(true);

        // Attendre 2 secondes pour laisser le temps de voir les cartes finales
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Traiter les données de fin de partie
        this.processGameResult(endGameData);

        // Afficher la modal de résultat
        this.isGameResultModalVisible.set(true);
      });
  }

  private processGameResult(endGameData: any): void {
    console.log('End game data:', endGameData);

    // Les données arrivent sous cette forme : { player: BlackJackPlayer, points: number }
    if (!endGameData || typeof endGameData.points === 'undefined') {
      console.warn('Invalid end game data structure:', endGameData);
      return;
    }

    const currentBet = this.playerBet();

    // Calculer le résultat basé sur les mains
    const playerHands = endGameData.player ? this.calculatePlayerHandsResult(endGameData.player) : [];
    const dealerHand = this.calculateDealerHandResult();

    // Calculer les gains selon les règles du blackjack
    let totalGains = 0;
    let isWin = false;
    let isTie = false;
    let hasAnyWin = false;
    let hasAnyTie = false;
    let hasAnyLoss = false;

    console.log('Player hands analysis:', playerHands);
    console.log('Dealer hand analysis:', dealerHand);

    playerHands.forEach((hand, index) => {
      console.log(`Hand ${index + 1}: ${hand.value} points - Status: ${hand.status}`);

      if (hand.status === 'blackjack') {
        // Blackjack naturel : mise × 2.5 (mise + gain de 1.5×mise)
        totalGains += currentBet * 2.5;
        hasAnyWin = true;
      } else if (hand.status === 'win') {
        // Victoire normale : mise × 2 (mise + gain égal à la mise)
        totalGains += currentBet * 2;
        hasAnyWin = true;
      } else if (hand.status === 'tie') {
        // Égalité : récupération de la mise
        totalGains += currentBet;
        hasAnyTie = true;
      } else {
        // Défaite ou bust : on ne récupère rien
        hasAnyLoss = true;
      }
    });

    // Déterminer le résultat global
    if (hasAnyWin) {
      isWin = true;
      isTie = false;
    } else if (hasAnyTie && !hasAnyLoss) {
      isWin = false;
      isTie = true;
    } else {
      isWin = false;
      isTie = false;
    }

    const netGain = totalGains - currentBet;

    console.log('Game result calculation:', {
      currentBet: currentBet,
      calculatedGains: totalGains,
      netGain: netGain,
      hasAnyWin,
      hasAnyTie,
      hasAnyLoss,
      finalResult: { isWin, isTie }
    });

    // Créer l'objet résultat
    this.gameResult = {
      isWin: isWin,
      isTie: isTie,
      bet: currentBet,
      winAmount: netGain,
      newBalance: endGameData.player ? endGameData.player.balance : this.playerBalance,
      playerHands: playerHands,
      dealerHand: dealerHand
    };
  }

  private calculatePlayerHandsResult(player: BlackJackPlayer): any[] {
    if (!player.hand || !Array.isArray(player.hand)) {
      return [];
    }

    return player.hand.map((hand: Card[], index: number) => {
      const handValue = this.calculateHandValue(hand);
      let status = 'lose';

      if (handValue > 21) {
        status = 'bust';
      } else {
        // Logique basée sur la comparaison avec le croupier
        const dealerValue = this.calculateHandValue(this.hands.dealerHand);

        if (handValue === 21 && hand.length === 2) {
          // Blackjack naturel (21 avec exactement 2 cartes)
          if (dealerValue === 21 && this.hands.dealerHand.length === 2) {
            status = 'tie'; // Les deux ont blackjack
          } else {
            status = 'blackjack'; // Blackjack du joueur uniquement
          }
        } else if (dealerValue > 21) {
          // Croupier bust, joueur gagne
          status = 'win';
        } else if (handValue > dealerValue) {
          // Joueur a une meilleure main
          status = 'win';
        } else if (handValue === dealerValue) {
          // Égalité
          status = 'tie';
        }
        // sinon reste 'lose'
      }

      return {
        value: handValue,
        status: status
      };
    });
  }

  private calculateDealerHandResult(): any {
    const dealerValue = this.calculateHandValue(this.hands.dealerHand);
    let status = 'normal';

    if (dealerValue > 21) {
      status = 'bust';
    }

    return {
      value: dealerValue,
      status: status
    };
  }

  private calculateHandValue(hand: Card[]): number {
    if (!hand || hand.length === 0) return 0;

    let value = 0;
    let aceCount = 0;

    for (const card of hand) {
      if (card.rank === 'A') {
        value += 11;
        aceCount++;
      } else if (['K', 'Q', 'J'].includes(card.rank)) {
        value += 10;
      } else {
        value += parseInt(card.rank) || 0;
      }
    }

    // Ajuster pour les As
    while (value > 21 && aceCount > 0) {
      value -= 10;
      aceCount--;
    }

    return value;
  }

  handleWaitingRoomConfirmClick(bet: number): void {
    this.handleWaitingRoomConfirm();

    this.playerBet.set(bet);
    this.playerBalance -= bet;

    console.log(`🎮 Rejouer avec mise : ${bet}, solde restant : ${this.playerBalance}`);
  }

  // Nouveaux handlers pour la modal de résultat
  handleGameResultReplay(): void {
    console.log('Player wants to replay');
    // Réinitialiser l'état de la partie
    this.gameEnded.set(false);
    this.showWaitingRoomModal();
  }

  handleGameResultQuit(): void {
    console.log('Player wants to quit');
    this.gameService.sendMessage(GameActions.QUIT_GAME, { gameId: this.gameId });
    this.router.navigateByUrl("/games");
  }

  protected override updateGameInfo(data: BlackJackResponse) {
    super.updateGameInfo(data);

    if (data?.dealerHand) {
      this.hands.dealerHand = data.dealerHand;
    }

    this.gameService.playersList.set(data.players.map((p) => (p as BlackJackPlayer)))
  }


}
