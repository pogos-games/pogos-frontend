import {inject, Injectable} from '@angular/core';
import {io, Socket} from "socket.io-client";
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class UnoService {

  private readonly socket:Socket
  private readonly configService:ConfigService = inject(ConfigService);
  private readonly GAMES_URL:string = this.configService.config.GAMES_URL;

  constructor() {
      this.socket = io(this.GAMES_URL + '/uno', {
        path: this.GAMES_URL.startsWith('https') ? '/api/games/socket.io' : '',
        transports: ['websocket'],
      });
  }


}
