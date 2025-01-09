import {Injectable, OnDestroy} from '@angular/core';
import {SocketService} from "../socket.service";
import {BehaviorSubject} from "rxjs";
import {BlackjackDeck} from "../../model/dto/request/black-jack-deck";

@Injectable({
  providedIn: 'root'
})
export class BlackjackService implements OnDestroy {

  readonly blackjackSubject = new BehaviorSubject<BlackjackDeck | undefined>(undefined);

  constructor(private readonly socketService:SocketService) {
    this.socketService.connect();
    this.socketService.listen<BlackjackDeck>('game_update').subscribe((message : BlackjackDeck) => {
      console.log('Received message from server:', message);
      this.blackjackSubject.next(message);
    });
  }

  sendMessage(topic : string): void {
    const message = 'Hello from Angular!';
    this.socketService.emit(topic, message);
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}
