import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";
import { NotificationsResponseDto } from '../model/dto/response/notifications-response.dto';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private readonly http: HttpClient) { }

  // c'est une liste de notifications
  getNotifications(userId: string): Observable<NotificationsResponseDto[]> {
    return this.http.get<NotificationsResponseDto[]>(`${environment.coreURL}/notifications/${userId}`);
  }
}
