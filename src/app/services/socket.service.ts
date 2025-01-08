import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {io, Socket} from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket:Socket | undefined;

  private readonly SOCKET_URL = 'http://localhost:3002/blackjack';

  constructor() {}

  connect(): void {
    this.socket = io(this.SOCKET_URL);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  listen<T>(event: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      if (this.socket) {
        this.socket.on(event, (data: T) => {
          subscriber.next(data);
        });
      }
      return () => {
        if (this.socket) {
          this.socket.off(event);
        }
      };
    });
  }
}
