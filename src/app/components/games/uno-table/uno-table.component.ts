import {Component, inject, signal, WritableSignal} from '@angular/core';
import {UnoHandComponent} from "../uno-hand/uno-hand.component";
import {UnoCardComponent} from "../uno-card/uno-card.component";
import {UnoCardBackComponent} from "../uno-card-back/uno-card-back.component";
import {UnoBackHandComponent} from "../uno-back-hand/uno-back-hand.component";
import {UnoCard, UnoCardColor, UnoCardType} from "../../../model/dto/uno/uno-card.interface";
import {UnoService} from "../../../services/uno.service";
import {ActivatedRoute} from "@angular/router";
import {UserAuthService} from "../../../services/auth/user-auth.service";
import {Direction, PlayerPrivateState, UnoGame, UnoGameState} from "../../../model/dto/uno/uno-game.interface";
import {GameActions} from "../../../model/enum/game.actions.enum";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {UnoGameCreated} from "../../../model/dto/uno/uno-game-created.interface";
import {UnoAction, UnoActionType} from "../../../model/dto/uno/uno-actions.interface";

@Component({
  selector: 'app-uno-table',
  imports: [
    UnoHandComponent,
    UnoCardComponent,
    UnoCardBackComponent,
    UnoBackHandComponent,
    NzBadgeComponent
  ],
  templateUrl: './uno-table.component.html',
  styleUrl: './uno-table.component.scss'
})
export class UnoTableComponent {


  private readonly unoService : UnoService = inject(UnoService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly userAuthService: UserAuthService = inject(UserAuthService);
  protected username : string = this.userAuthService.user().pseudo;
  protected unoGameState: UnoGameState = { 'players': [], 'topCard': {
    'color': UnoCardColor.Red,
    'type': UnoCardType.Number,
    'value': 0
    }, 'currentTurnPlayerId': '', 'direction': Direction.CLOCKWISE };
  protected gameId: string = '';
  // currentPlayerId
  protected playerId: string = ''
  protected playerCards : WritableSignal<UnoCard[]> = signal([]);

  constructor() {
    const gameType = this.route.snapshot.queryParams['gameType']
    if(gameType === 'solo') {
      console.log('game type is solo');
      this.unoService.sendMessage(GameActions.CREATE_GAME, {
        playerName: this.username,
        mode: gameType.toUpperCase()
      })
    }

    this.unoService.listenToTopic<UnoGameCreated>('GAME_CREATED').subscribe((data: UnoGameCreated) => {
      this.gameId = data.gameId
      this.playerId = data.playerId
      this.unoService.setGameId(data.gameId);
    })

    this.unoService.listenToTopic<UnoGame>('GAME_STATE').subscribe((data: UnoGame) => {
      console.log('game state received');
      this.unoGameState = data.state;
    })

    this.unoService.listenToTopic<PlayerPrivateState>('PRIVATE_STATE').subscribe((data: PlayerPrivateState) => {
      console.log('new info received')
      console.log('cards lenght', data.hand.length)
      this.playerCards.set(data.hand);
      console.log('Received private state:', data);
    })
  }

  drawCard() {
    if(this.isPlayerTurn(this.playerId)) {
      const unoAction: UnoAction = {
        roomId: this.gameId,
        type: UnoActionType.DRAW_CARD,
        card: undefined,
        playerId: this.playerId
      }
      this.unoService.sendMessage('ACTION', unoAction)
    }
  }

  isPlayerTurn(playerId: string) : boolean {
    console.log('current turn player id:', this.unoGameState.currentTurnPlayerId);
    console.log('player id:', playerId);
    return this.unoGameState.currentTurnPlayerId  === playerId;
  }
}
