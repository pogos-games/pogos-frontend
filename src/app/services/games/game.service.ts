import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {Observable, shareReplay, Subject} from 'rxjs';
import {GameActions} from '../../model/dto/game/enum/gateway/game.actions.enum';
import {GatewayEventEmitter} from '../../model/dto/game/enum/gateway/gateway-event-emitter.enum';
import {ConfigService} from "../config.service";
import {GameMode} from "../../model/dto/game/enum/game-mode.enum";
import {GameResponse} from "../../model/dto/game/response/game-response.interface";
import {GamePlayerResponse} from "../../model/dto/game/response/game-player-response.interface";
import {Player} from "../../model/dto/game/player.interface";
import {BaseCard} from "../../model/dto/game/card.interface";
import {ChatMessage} from "../../model/dto/chat-message.dto";

@Injectable({
  providedIn: 'root'
})
export abstract class GameService<
  TResponse extends GameResponse<TPlayerResponse>,
  TPlayer extends Player,
  TPlayerResponse extends GamePlayerResponse,
  TCard extends BaseCard
> {

  protected socket!: Socket;
  protected readonly configService: ConfigService = inject(ConfigService);
  protected readonly GAMES_SOCKET  = this.configService.config.GAMES_SOCKET ;
  protected gameId: string  = '';
  protected playerId: string  = '';
  public playersList: WritableSignal<any[]> = signal([]);
  public players: TPlayer[] = [];
  protected gameUrl: string = "";
  public gameMode: string = GameMode.SOLO;
  protected errorStartGame: string = "";

  protected initializeSocket(): void {
    this.socket = io(this.GAMES_SOCKET + this.gameUrl, {
      path: this.GAMES_SOCKET.startsWith('https') ? '/api/games/socket.io' : '',
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      this.playerId = this.socket.id!;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket déconnecté !');
      this.playerId = '';
    });
  }

  getPlayerId(): string  {
    return this.playerId;
  }

  setGameId(gameId: string): void {
    this.gameId = gameId;
  }

  getGameId(): string  {
    return this.gameId;
  }

  setGameMode(mode: GameMode){
    this.gameMode = mode;
  }

  getGameMode(){
    return this.gameMode;
  }

  sendMessage(action: string, payload: any = {}): void {
    // Si on est en train de créer la partie (action CREATE_GAME), on permet d'envoyer sans gameId et playerId
    if ((action === GameActions.CREATE_GAME || action === GameActions.JOIN_GAME) && !this.gameId) {
      const enrichedPayload = {
        ...payload
      };

      this.socket.emit(action, enrichedPayload);
      return;
    }

    if (!this.gameId || !this.playerId) {
      console.warn("Impossible d'envoyer l'action, gameId ou playerId manquant !");
      return;
    }

    const enrichedPayload = {
      gameId: this.gameId,
      ...payload
    };

    this.socket.emit(action, enrichedPayload);
  }

  listenGameUpdate(): Observable<TResponse> {
    return new Observable<TResponse>(observer => {
      this.socket.on(GatewayEventEmitter.GAME_UPDATE, (data: TResponse) => {
        observer.next(data);
      });
    }).pipe(shareReplay(1));
  }

  listenStartGame(): Observable<void> {
    return new Observable(observer => {
      this.socket.on(GatewayEventEmitter.START_GAME, () => {
        observer.next();
      });
    });
  }

  listenStartGamePlayerUpdate(): Observable<void> {
    const checkStartGame = new Subject<void>();
    this.listenGameUpdate().subscribe((data) => {
      if (data.players) {
        this.playersList.set(data.players.map((p: any) => p.playerId));
      } else {
        this.playersList.update(players => [...players, data]);
      }
      checkStartGame.next();
    });
    return checkStartGame.asObservable();
  }

  listenEndGame(): Observable<any> {
    return new Observable(observer => {
      this.socket.on(GatewayEventEmitter.END_GAME, (data: any) => {
        observer.next(data);
      });
    });
  }

  listenPlayerUpdate(): Observable<TPlayerResponse> {
    return new Observable<TPlayerResponse>(observer => {
      this.socket.on(GatewayEventEmitter.PLAYER_UPDATE, (data: TPlayerResponse) => {
        observer.next(data);
      });
    });
  }

  listenChatUpdate(): Observable<ChatMessage> {
    return new Observable<ChatMessage>(observer => {
      this.socket.on(GatewayEventEmitter.CHAT, (data: ChatMessage) => {
        observer.next(data)
      })
    })
  }

  disconnect(): void {
    console.log('Déconnexion WebSocket...');
    this.socket.removeAllListeners(GatewayEventEmitter.GAME_UPDATE);
    this.socket.removeAllListeners(GatewayEventEmitter.PLAYER_UPDATE);
    this.socket.removeAllListeners(GatewayEventEmitter.END_GAME);
    this.socket.disconnect();
    this.gameId = '';
    this.playerId = '';
  }

  setBet(bet: number){
    console.log("setBet: " + bet)
  }

  getBet(): number {return -1}

  abstract checkStartGame(): boolean;

  getErrorStartGame() {
    const error = this.errorStartGame;
    this.errorStartGame = "";
    return error
  }
}

