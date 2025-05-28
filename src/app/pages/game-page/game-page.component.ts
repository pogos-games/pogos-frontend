import { Component, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from '../../components/common/header/header.component';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { GameSelectorComponent } from '../../components/pages/game-page/game-selector/game-selector.component';
import { GameButtonsComponent } from '../../components/pages/game-page/game-buttons/game-buttons.component';
import { RankingComponent } from '../../components/pages/game-page/ranking/ranking.component';
import { BoxJoinCodeComponent } from '../../components/pages/game-page/box-join-code/box-join-code.component';
import { WaitingRoomModalComponent } from '../../components/common/waiting-room-modal/waiting-room-modal.component';
import { Router } from '@angular/router';
import {GameService} from "../../services/games/game.service";
import {GameActions} from "../../model/enum/game.actions.enum";

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
  public gameBet: WritableSignal<number> = signal(-1);
  public playerNames: string[] = [];
  protected title = 'BlackJack';

  constructor(
    private readonly router: Router,
    protected gameService: GameService
  ) {}

  public showModal(gameService: GameService): void {
    this.gameService = gameService;
    const players = this.gameService.getPlayers();
    this.playerNames = players?.map(p => p.name || p.playerId) ?? [];
    this.gameBet.set(this.gameService.getBet());
    this.isWaitingRoomModalVisible.set(true);
  }

  public handleStartGame(bet: number): void {
    if (this.gameService.checkStartGame()) {
      this.gameService.setBet(bet);
      this.gameService.sendMessage(GameActions.START_GAME, {type: this.gameService.getGameType(), bet: bet});
      this.isWaitingRoomModalVisible.set(false);
      this.router.navigate(['/games', this.title.toLowerCase()], {
        queryParams: {gameType: 'solo'}
      });
    }
  }

  public handleCancelModal(): void {
    this.gameService.sendMessage(GameActions.QUIT_GAME);
    this.isWaitingRoomModalVisible.set(false);
  }

  public get gameId(): string {
    return this.gameService.getGameId() ?? '';
  }

  gameName(name: string) {
    this.title = name;
  }
}
