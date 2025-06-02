import {Injectable, signal, WritableSignal} from '@angular/core';
import {GameService} from "./games/game.service";
import {Direction, PlayerPrivateState, UnoGame, UnoGameState} from "../model/dto/uno/uno-game.interface";
import {UnoCard, UnoCardColor, UnoCardType} from "../model/dto/uno/uno-card.interface";
import {UnoGameCreated} from "../model/dto/uno/uno-game-created.interface";

@Injectable({
  providedIn: 'root'
})
export class UnoService extends GameService{

  public unoGameState: WritableSignal<UnoGameState> = signal({ 'players': [], 'topCard': {
      'color': UnoCardColor.Red,
      'type': UnoCardType.Number,
      'value': 0
    }, 'currentTurnPlayerId': '', 'direction': Direction.CLOCKWISE });

  public playerCards : WritableSignal<UnoCard[]> = signal([]);


  constructor() {
    super();
    this.gameUrl = '/uno';
    this.initializeSocket();

    this.listenToTopic<UnoGameCreated>('GAME_CREATED').subscribe((data: UnoGameCreated) => {
      this.gameId = data.gameId
      this.playerId = data.playerId
      console.log('data player id', this.playerId);
      this.setGameId(data.gameId);
    })

    this.listenToTopic<UnoGame>('GAME_STATE').subscribe((data: UnoGame) => {
      console.log('game state received');
      this.unoGameState.set(data.state);
    })

    this.listenToTopic<PlayerPrivateState>('PRIVATE_STATE').subscribe((data: PlayerPrivateState) => {
      console.log('new info received')
      console.log('cards lenght', data.hand.length)
      this.playerCards.set(data.hand);
      console.log('Received private state:', data);
    })

  }


}
