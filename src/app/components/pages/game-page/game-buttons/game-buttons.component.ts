import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {GameActions} from "../../../../model/dto/game/enum/gateway/game.actions.enum";
import {GameMode} from "../../../../model/dto/game/enum/game-mode.enum";
import {GameServiceFactory} from "../../../common/factory/game.service.factory";
import {GameService} from "../../../../services/games/game.service";
import {ConfigService} from "../../../../services/config.service";
import {HttpClient} from "@angular/common/http";
import {catchError, expand, of, take, takeWhile, timer} from "rxjs";
import {switchMap} from "rxjs/operators";
import {UserAuthService} from "../../../../services/auth/user-auth.service";

@Component({
  selector: 'app-game-buttons',
  imports: [
    NzButtonComponent,
    NzColDirective,
    NzRowDirective
  ],
  templateUrl: './game-buttons.component.html',
  standalone: true,
  styleUrl: './game-buttons.component.scss'
})
export class GameButtonsComponent {

  @Output() showModalEvent = new EventEmitter<{ gameService: GameService<any, any, any, any>, showPrivacy: boolean, unsubscribe: () => void}>();
  @Output() joinRandomGame = new EventEmitter<void>();

  @Input() gameName: string = "BlackJack";

  constructor(
    private readonly configService: ConfigService,
    private readonly userAuthService: UserAuthService,
    private readonly http: HttpClient,
    private readonly gameServiceFactory: GameServiceFactory) {}

  protected showModal(mode: GameMode) {
    let gameService = this.gameServiceFactory.getService(this.gameName);

    if (!gameService) {
      console.error(`No service found for game title: ${this.gameName}`);
      return;
    }

    gameService.setGameMode(mode);
    const user = this.userAuthService.user()
    gameService.sendMessage(GameActions.CREATE_GAME,{playerName: user.pseudo, avatar: user.avatar, mode: mode});
    this.subToGame(gameService, true);
  }

  protected joinRandom() {
    let gameService = this.gameServiceFactory.getService(this.gameName);

    if (!gameService) {
      console.error(`No service found for game title: ${this.gameName}`);
      return;
    }
    const clientId = gameService.getPlayerId()
    let lastResult: { success: boolean; gameId: string, gameName: string} | null = null;

    of(null).pipe(
      switchMap(() =>
        this.http.get<{ success: boolean; gameId: string, gameName: string, gameMode: GameMode }>(
          `${this.configService.config.GAMES_URL}/game/join-random`,
          {
            params: {
              clientId: clientId
            }
          }
        )
      ),
      expand((res, i) => {
        if (res.success || i >= 9) return of(res); // Stop retrying if success or 10th attempt
        return timer(600).pipe(
          switchMap(() =>
            this.http.get<{ success: boolean; gameId: string, gameName: string, gameMode: GameMode }>(
              `${this.configService.config.GAMES_URL}/game/join-random`,
              {
                params: {
                  clientId: clientId
                }
              }
            )
          )
        );
      }),
      takeWhile(res => !res.success, true), // Continue until success or final failure
      take(10), // Max 10 attempts
      catchError(err => {
        console.error('Error during game join retries:', err);
        return of(null);
      })
    ).subscribe({
      next: (res: { success: boolean, gameId: string, gameName: string, gameMode: GameMode } |null) => {
        if (res?.success) {
          gameService = this.gameServiceFactory.getService(res.gameName);
          if (gameService) {
            gameService.setGameMode(res.gameMode)
            gameService.sendMessage(GameActions.JOIN_GAME, {
              gameId: res.gameId,
              playerName: this.userAuthService.user().pseudo,
              avatar: this.userAuthService.user().avatar
            });
            this.subToGame(gameService, false);
          }
        }
        lastResult = res;
      },
      complete: () => {
        if (!lastResult?.success) {
          console.warn('Unable to join a game after 10 attempts.');
        }
      }
    });
  }

  private subToGame(gameService: GameService<any, any, any, any>, showPrivacy: boolean) {
    const sub = gameService.listenGameUpdate()
      .subscribe((data: any) => {
        const gameId = typeof data === 'string' ? data : data?.gameId;

        if (gameId) {
          gameService.setGameId(gameId);
        } else {
          console.error("Erreur : ID de la partie non reçu.", data);
        }

        gameService.playersList.set(data.players)
        this.showModalEvent.emit({gameService: gameService, showPrivacy: showPrivacy, unsubscribe: () => sub.unsubscribe() });
      });
  }
  protected readonly GameMode = GameMode;
}
