import {inject, Injectable, OnDestroy} from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, shareReplay } from 'rxjs';
import { GameActions } from '../../model/enum/game.actions.enum';
import { GatewayEventEmitter } from '../../model/enum/gateway-event-emitter.enum';
import {ConfigService} from "../config.service";
import {GameType} from "../../model/enum/game-type.enum";

@Injectable({
  providedIn: 'root'
})

export class GameService implements OnDestroy{
  
  protected socket!: Socket;
  protected readonly configService: ConfigService = inject(ConfigService);
  protected readonly GAMES_SOCKET  = this.configService.config.GAMES_SOCKET ;
  protected gameId: string | null = null;
  protected playerId: string | null = null;
  protected players: any[] = [];
  protected gameUrl: string = "";
  protected gameType: string = GameType.SOLO;

  setPlayers(players: any[]): void {
    this.players = players;
  }

  getPlayers(): any[] {
    return this.players;
  }

  constructor() {}

  protected initializeSocket(): void {
    this.socket = io(this.GAMES_SOCKET + this.gameUrl, {
      path: this.GAMES_SOCKET.startsWith('https') ? '/api/games/socket.io' : '',
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      this.playerId = this.socket.id!;
    });

    this.socket.on('disconnect', () => {
      this.playerId = null;
    });
  }

  getPlayerId(): string | null {
    return this.playerId;
  }

  setGameId(gameId: string): void {
    this.gameId = gameId;
  }

  getGameId(): string | null {
    return this.gameId;
  }

  setGameType(type: GameType){
    this.gameType = type;
  }

  getGameType(){
    return this.gameType;
  }

  sendMessage(action: string, payload: any = {}): void {
    if ((action === GameActions.CREATE_GAME) && !this.gameId) {
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

  listenGameUpdate(): Observable<any> {
    return new Observable(observer => {
      this.socket.on(GatewayEventEmitter.GAME_UPDATE, (data: any) => {
        observer.next(data);
      });
    }).pipe(shareReplay(1));
  }

  listenEndGame(): Observable<any> {
    return new Observable(observer => {
      this.socket.on(GatewayEventEmitter.END_GAME, (data: any) => {
        observer.next(data);
      });
    });
  }

  listenPlayerUpdate(): Observable<any> {
    return new Observable(observer => {
      this.socket.on(GatewayEventEmitter.PLAYER_UPDATE, (data: any) => {
        observer.next(data);
      });
    });
  }

  disconnect(): void {
    console.log('Déconnexion WebSocket...');
    this.socket.removeAllListeners(GatewayEventEmitter.GAME_UPDATE);
    this.socket.removeAllListeners(GatewayEventEmitter.PLAYER_UPDATE);
    this.socket.removeAllListeners(GatewayEventEmitter.END_GAME);
    this.socket.disconnect();
    this.gameId = null;
    this.playerId = null;
  }

  setBet(bet: number){
    console.log("setBet: " + bet)
  }

  getBet(): number {return -1}

  abstract checkStartGame(): boolean;
}

