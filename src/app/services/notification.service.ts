import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {NotificationsResponseDto} from '../model/dto/response/notifications-response.dto';
import {ConfigService} from "./config.service";
import {io} from "socket.io-client";
import {UserAuthService} from "./auth/user-auth.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly configService = inject(ConfigService);

  private readonly httpClient: HttpClient = inject(HttpClient);

  private readonly userAuthService = inject(UserAuthService);

  private readonly CORE_URL = this.configService.config.CORE_URL;
  private readonly CORE_SOCKET = this.configService.config.CORE_SOCKET;

  public readonly notifications : WritableSignal<NotificationsResponseDto[]> = signal([]);


  // c'est une liste de notifications
  getNotifications(userId: string): Observable<NotificationsResponseDto[]> {
    return this.httpClient.get<NotificationsResponseDto[]>(`${this.CORE_URL}/notifications/${userId}`);
  }

  deleteNotification(notificationId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.CORE_URL}/notifications/${notificationId}`).pipe(
      tap(() => {
        this.deleteNotificationFromList(notificationId);
      })
    );
  }

  constructor() {
    this.getNotifications(this.userAuthService.user().id).subscribe((response: NotificationsResponseDto[]) => {
      this.notifications.update((current: NotificationsResponseDto[]) => [...current, ...response]);
    });
    this.handleNotificationsSockets();
  }

  handleNotificationsSockets() {

    if(this.userAuthService.isUserLoggedIn() && this.userAuthService.isTokenExpired()){
      this.userAuthService.updateToken().subscribe(data => {
        this.connectToNotificationsSockets();
      })
    } else {
      this.connectToNotificationsSockets();
    }
  }

  connectToNotificationsSockets(){
    const socket = io(this.CORE_SOCKET + '/notifications', {
      path: this.CORE_URL.startsWith('https') ? '/api/games/socket.io' : '',
      transports: ['websocket'],
      auth: {
        token: `Bearer ${this.userAuthService.getAccessToken()}`
      }
    });

    socket.on('NOTIFICATION', (notification: NotificationsResponseDto) => {
      console.log('notification received', notification);
      this.notifications.update((notifications: NotificationsResponseDto[]) => {
        const exists = notifications.some(n => n.id === notification.id);
        if (exists) {
          return notifications;
        }
        return [...notifications, notification];
      });
    });
  }

  deleteNotificationFromList(notificationId: string): void {
    const current = this.notifications();
    this.notifications.set(
      current.filter(n => n.id !== notificationId)
    );
  }

}
