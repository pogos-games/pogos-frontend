import { Injectable, OnDestroy } from '@angular/core';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class PokerService implements OnDestroy{

  constructor(private readonly socketService:SocketService) { }

  sendMessage(topic : string): void {
    const message = 'Hello from Angular!';
    this.socketService.emit(topic, message);
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}
