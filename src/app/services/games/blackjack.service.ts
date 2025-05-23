import {inject, Injectable} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {Observable, shareReplay} from 'rxjs';
import {GameActions} from '../../model/enum/game.actions.enum';
import {BlackJackActions} from '../../model/enum/black-jack.actions.enum';
import {GatewayEventEmitter} from '../../model/enum/gateway-event-emitter.enum';
import {ConfigService} from "../config.service";

@Injectable({
  providedIn: 'root'
})
export class BlackjackService {

  private readonly socket: Socket;
  private readonly configService: ConfigService = inject(ConfigService);
  private readonly GAMES_SOCKET = this.configService.config.GAMES_SOCKET;

  private gameId: string | null = null;
  private playerId: string | null = null;
  private players: any[] = [];
  private playerBet: number = 0;

  setPlayers(players: any[]): void {
    this.players = players;
  }

  getPlayers(): any[] {
    return this.players;
  }

  setPlayerBet(bet: number): void {
    this.playerBet = bet;
  }

  getPlayerBet(): number {
    return this.playerBet;
  }


  constructor() {
    this.socket = io(this.GAMES_SOCKET + '/blackjack', {
      path: '/api/games/socket.io',
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connecté !', this.socket.id);
      this.playerId = this.socket.id!;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket déconnecté !');
      this.playerId = null;
    });
  }

  getPlayerId(): string | null {
    return this.playerId;
  }

  setGameId(gameId: string): void {
    this.gameId = gameId;
    console.log("Game ID stocké dans le service :", this.gameId);
  }

  getGameId(): string | null {
    return this.gameId;
  }

  sendMessage(action: GameActions | BlackJackActions, payload: any = {}): void {
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
    this.playerId = null;
  }
}

