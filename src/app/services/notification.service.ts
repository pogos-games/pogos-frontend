import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {NotificationsResponseDto} from '../model/dto/response/notifications-response.dto';
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly configService = inject(ConfigService);

  private readonly httpClient: HttpClient = inject(HttpClient);

  private readonly CORE_URL = this.configService.config.CORE_URL;

  // c'est une liste de notifications
  getNotifications(userId: string): Observable<NotificationsResponseDto[]> {
    return this.httpClient.get<NotificationsResponseDto[]>(`${this.CORE_URL}/notifications/${userId}`);
  }
}
