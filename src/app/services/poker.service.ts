import { Injectable, OnDestroy } from '@angular/core';
import { SocketService } from './socket.service';
import { PokerEvent } from '../model/dto/request/poker-event';
import { PokerPlayerEvent } from '../model/dto/request/poker-player-event';
import {BehaviorSubject} from "rxjs";
import { PokerActions } from '../model/enum/poker.actions.enum';

@Injectable({
  providedIn: 'root'
})
export class PokerService implements OnDestroy{

  readonly pokerSubject = new BehaviorSubject<PokerEvent | undefined>(undefined);
  readonly pokerPlayerSubject = new BehaviorSubject<PokerPlayerEvent | undefined>(undefined);

  constructor(private readonly socketService:SocketService) {
    this.socketService.connect();
    this.socketService.listen<PokerEvent>('GAME_UPDATE').subscribe((message : PokerEvent) => {
      console.log('Received message from server:', message);
      this.pokerSubject.next(message);
    });
    this.socketService.listen<PokerPlayerEvent>('PLAYER_UPDATE').subscribe((message : PokerPlayerEvent) => {
      console.log('Received message from server:', message);
      this.pokerPlayerSubject.next(message);
    });
  }

  sendMessage(action : PokerActions): void {
    const message = 'Hello from Angular!';
    this.socketService.emit(action, message);
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}
