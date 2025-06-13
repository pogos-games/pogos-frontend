import {Injectable, signal, WritableSignal} from '@angular/core';
import {GameService} from "./games/game.service";
import {PlayerPrivateState, UnoDirection, UnoGame, UnoGameState, UnoPlayer} from "../model/dto/uno/uno-game.interface";
import {UnoCard, UnoCardColor, UnoCardType} from "../model/dto/uno/uno-card.interface";
import {UnoGameCreated} from "../model/dto/uno/uno-game-created.interface";
import {UnoEndGame} from "../model/dto/uno/uno-end-game.interface";

@Injectable({
  providedIn: 'root'
})
export class UnoService extends GameService{

  public unoGameState: WritableSignal<UnoGameState> = signal({ 'players': [], 'topCard': {
      'color': UnoCardColor.RED,
      'type': UnoCardType.NUMBER,
      'value': 0
    }, 'currentTurnPlayerId': '', 'direction': UnoDirection.CLOCKWISE, gameWinner: ''});

  public playerCards : WritableSignal<UnoCard[]> = signal([]);

  public isGameEnded: WritableSignal<boolean> = signal(false);

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

    this.listenToTopic<UnoEndGame>('GAME_ENDED').subscribe((data : UnoEndGame) => {
      console.log('game ended received');
      this.unoGameState().gameWinner = data.winner
      this.isGameEnded.set(true);
      this.gameId = ''
    })
  }

  isPlayerTurn() {
    return this.unoGameState().currentTurnPlayerId === this.playerId;
  }

  checkStartGame(): boolean {
    return true;
  }

  getOrderedPlayers(): UnoPlayer[] {
    const state = this.unoGameState();
    const players = state.players;
    const myId = this.getPlayerId();
    const myIndex = players.findIndex(p => p.id === myId);

    if (myIndex === -1) return players; // fallback

    return [
      ...players.slice(myIndex),
      ...players.slice(0, myIndex)
    ];
  }



}
