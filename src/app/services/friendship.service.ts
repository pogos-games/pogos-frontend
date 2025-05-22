import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { FriendshipResponseDto } from "../model/dto/response/friendship-response.dto";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  private readonly http: HttpClient = inject(HttpClient);

  private readonly configService = inject(ConfigService);

  private readonly CORE_URL = this.configService.config.CORE_URL;

  // afficher les amis
  getFriendship(userId: string): Observable<FriendshipResponseDto[]> {
    return this.http.get<FriendshipResponseDto[]>(`${this.CORE_URL}/friendship/${userId}`);
  }

  // accepter une demande d'ami
  acceptFriendship(friendshipId: string): Observable<void> {
    return this.http.post<void>(`${this.CORE_URL}/friendship/ACCEPT/${friendshipId}`, {});
  }

  // refuser une demande d'ami
  rejectFriendship(friendshipId: string): Observable<void> {
    return this.http.post<void>(`${this.CORE_URL}/friendship/REJECT/${friendshipId}`, {});
  }

  // Envoyer une demande d'ami
  sendFriendship(userId: string): Observable<void> {
    return this.http.post<void>(`${this.CORE_URL}/friendship/send/${userId}`, {});
  }
}
