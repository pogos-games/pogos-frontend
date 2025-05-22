import { Component, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from '../../components/common/header/header.component';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { GameSelectorComponent } from '../../components/pages/game-page/game-selector/game-selector.component';
import { GameButtonsComponent } from '../../components/pages/game-page/game-buttons/game-buttons.component';
import { RankingComponent } from '../../components/pages/game-page/ranking/ranking.component';
import { BoxJoinCodeComponent } from '../../components/pages/game-page/box-join-code/box-join-code.component';
import { WaitingRoomModalComponent } from '../../components/common/waiting-room-modal/waiting-room-modal.component';
import { Router } from '@angular/router';
import { BlackjackService } from '../../services/games/blackjack.service';

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
  public betAmount: number = 0;
  public playerNames: string[] = [];
  protected title = 'Blackjack';

  constructor(
    private readonly router: Router,
    protected blackJackService: BlackjackService
  ) {}

  public showModal(): void {
    const players = this.blackJackService.getPlayers();
    this.playerNames = players?.map(p => p.name || p.playerId) ?? [];
    this.isWaitingRoomModalVisible.set(true);
  }

  public handleStartGame(bet: number): void {
    this.betAmount = bet;
    this.blackJackService.setPlayerBet(bet);
    this.isWaitingRoomModalVisible.set(false);
    this.router.navigate(['/games', this.title.toLowerCase()], {
      queryParams: { gameType: 'solo' }
    });
  }

  public handleCancelModal(): void {
    this.isWaitingRoomModalVisible.set(false);
  }

  public get gameId(): string {
    return this.blackJackService.getGameId() ?? '';
  }
}
