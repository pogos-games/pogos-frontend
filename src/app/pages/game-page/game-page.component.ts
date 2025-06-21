import {Component, signal, WritableSignal} from '@angular/core';
import {HeaderComponent} from '../../components/common/header/header.component';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {GameSelectorComponent} from '../../components/pages/game-page/game-selector/game-selector.component';
import {GameButtonsComponent} from '../../components/pages/game-page/game-buttons/game-buttons.component';
import {RankingComponent} from '../../components/pages/game-page/ranking/ranking.component';
import {BoxJoinCodeComponent} from '../../components/pages/game-page/box-join-code/box-join-code.component';
import {WaitingRoomModalComponent} from '../../components/common/waiting-room-modal/waiting-room-modal.component';
import {Router} from '@angular/router';
import {GameService} from "../../services/games/game.service";
import {GameActions} from "../../model/dto/game/enum/gateway/game.actions.enum";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../services/config.service";
import {GameServiceFactory} from "../../components/common/factory/game.service.factory";
import {GameMode} from "../../model/dto/game/enum/game-mode.enum";
import {UserAuthService} from "../../services/auth/user-auth.service";
import {Player} from "../../model/dto/game/player.interface";

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [
    HeaderComponent,
    NzRowDirective,
    NzColDirective,
    GameSelectorComponent,
    GameButtonsComponent,
    RankingComponent,
    BoxJoinCodeComponent,
    WaitingRoomModalComponent
  ],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss'
})
export class GamePageComponent {
  public isWaitingRoomModalVisible: WritableSignal<boolean> = signal(false);
  public errorWaitingRoom: WritableSignal<string> = signal("");
  public gameBet: WritableSignal<number> = signal(-1);
  public players: WritableSignal<Player[]> = signal([]);
  protected title = 'BlackJack';
  protected subStartGamePlayerUpdate: Subscription = new Subscription();
  protected subStartGame: Subscription = new Subscription();
  protected showPrivacy= false;

  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly userAuthService: UserAuthService,
    protected gameService: GameService<any, any, any, any>,
    private readonly gameServiceFactory: GameServiceFactory
  ) {}

  public showModal(res: { unsubscribe: () => void; showPrivacy: boolean; gameService: GameService<any, any, any, any> }): void {
    this.gameService = res.gameService;
    this.players.set(this.gameService.playersList().map((p) => p as Player));
    this.gameBet.set(this.gameService.getBet());
    this.isWaitingRoomModalVisible.set(true);
    if (this.gameService.getBet() == -1 && this.gameService.gameMode === GameMode.SOLO) {
      this.isWaitingRoomModalVisible.set(false);
      res.unsubscribe()
      this.gameService.sendMessage(GameActions.START_GAME,{mode: this.gameService.getGameMode(), gameId: this.gameService.getGameId()});
    }
    this.subStartGamePlayerUpdate = this.gameService.listenStartGamePlayerUpdate().subscribe();
    this.subStartGame = this.gameService.listenStartGame().subscribe(() => {
      res.unsubscribe()
      this.gameService.listenGameUpdate().subscribe()
      if (this.gameService.checkStartGame()) {
        this.subStartGamePlayerUpdate.unsubscribe()
        this.isWaitingRoomModalVisible.set(false);
        this.router.navigate(['/games', this.title.toLowerCase()], {
          queryParams: {gameMode: this.gameService.gameMode}
        });
      }
    });
    this.showPrivacy = res.showPrivacy;
  }

  public handleStartGame(bet: number): void {
    if (this.gameService.checkStartGame()) {
      this.subStartGamePlayerUpdate.unsubscribe()
      this.errorWaitingRoom.set("")
      this.gameService.setBet(bet);
      this.gameService.sendMessage(GameActions.START_GAME, {mode: this.gameService.getGameMode(), bet: bet});
      this.isWaitingRoomModalVisible.set(false);
      this.router.navigate(['/games', this.title.toLowerCase()], {
        queryParams: {gameMode: this.gameService.gameMode}
      });
    } else {
      this.errorWaitingRoom.set(this.gameService.getErrorStartGame());
    }
  }

  public handleCancelModal(): void {
    this.gameService.sendMessage(GameActions.QUIT_GAME);
    this.errorWaitingRoom.set("")
    this.players.set([]);
    this.subStartGamePlayerUpdate.unsubscribe()
    this.subStartGame.unsubscribe()
    this.isWaitingRoomModalVisible.set(false);
  }

  public get gameId(): string {
    return this.gameService.getGameId() ?? '';
  }

  gameName(name: string) {
    this.title = name;
  }

  public changePrivacy() {
    const gameId = this.gameId
    const clientId = this.gameService.getPlayerId()
    this.http.post<boolean>(`${this.configService.config.GAMES_URL}/game/private-mode`, { gameId, clientId }).subscribe();
  }

  public searchGame(code: string){
    const clientId = this.gameService.getPlayerId()
    code = code.replace('#',"")
    this.http.get<{ success: string, gameName: string }>(
      `${this.configService.config.GAMES_URL}/game/find`,
      { params:{ gameId: code, clientId: clientId }
      }).subscribe((res) => {
        if (!res.success) return
        let gameService = this.gameServiceFactory.getService(res.gameName);
        console.log(res)
        if (!(gameService instanceof GameService)) return;

        const user = this.userAuthService.user()
        gameService.sendMessage(GameActions.JOIN_GAME, {gameId: `#${code}`, playerName:user.pseudo, avatar:user.avatar});
        const sub = gameService.listenGameUpdate().subscribe((data: any) => {
          const gameId = typeof data === 'string' ? data : data?.gameId;

          if (gameId && gameService) {
            gameService.setGameId(gameId);
          } else {
            console.error("Erreur : ID de la partie non reçu.", data);
          }

          sub.unsubscribe();
        });
        this.showModal({gameService: gameService, showPrivacy: false, unsubscribe: () => {}});
      });
  }
}
