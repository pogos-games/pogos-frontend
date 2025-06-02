import {inject, Injectable, OnDestroy} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {Observable, shareReplay} from 'rxjs';
import {GameActions} from '../../model/enum/game.actions.enum';
import {GatewayEventEmitter} from '../../model/enum/gateway-event-emitter.enum';
import {ConfigService} from "../config.service";

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnDestroy{

  protected socket!: Socket;
  protected readonly configService: ConfigService = inject(ConfigService);
  protected readonly GAMES_SOCKET  = this.configService.config.GAMES_SOCKET ;
  protected gameId: string | null = null;
  protected playerId: string  = '';
  protected players: any[] = [];
  protected gameUrl: string = "";

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
      console.log('WebSocket connecté !', this.socket.id);
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
    console.log("Game ID stocké dans le service :", this.gameId);
  }

  getGameId(): string | null {
    return this.gameId;
  }

  sendMessage(action: string, payload: any = {}): void {
    // Si on est en train de créer la partie (action CREATE_GAME), on permet d'envoyer sans gameId et playerId
    if ((action === GameActions.CREATE_GAME) && !this.gameId) {
      const enrichedPayload = {
        ...payload
      };

      this.socket.emit(action, enrichedPayload);
      return;  // Ne pas vérifier gameId et playerId pour CREATE_GAME
    }

    // Sinon, vérifier que gameId et playerId sont définis avant d'envoyer l'action
    if (!this.gameId || !this.playerId) {
      console.warn("Impossible d'envoyer l'action, gameId ou playerId manquant !");
      return;
    }

    const enrichedPayload = {
      gameId: this.gameId,
      //playerId: this.playerId,
      ...payload
    };

    console.log(`Envoi WebSocket : ${action}`, enrichedPayload);
    this.socket.emit(action, enrichedPayload);
  }


  listenGameUpdate(): Observable<any> {
    return new Observable(observer => {
      this.socket.on(GatewayEventEmitter.GAME_UPDATE, (data: any) => {
        console.log("GAME_UPDATE reçu :", data);
        observer.next(data);
      });
    }).pipe(shareReplay(1));
  }


  listenEndGame(): Observable<any> {
    return new Observable(observer => {
      this.socket.on(GatewayEventEmitter.END_GAME, (data: any) => {
        console.log("END_GAME reçu :", data);
        observer.next(data);
      });
    })
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
    this.socket.disconnect();
    this.gameId = null;
    this.playerId = '';
  }

  setBet(bet: number){
    console.log("setBet: " + bet)
  }

  getBet(): number {return -1}


  listenToTopic<T>(topic: string): Observable<T> {
    return new Observable(observer => {
      this.socket.on(topic, (data: any) => {
        observer.next(data);
      });
    });
  }

  ngOnDestroy() {
    this.disconnect();
  }

}

