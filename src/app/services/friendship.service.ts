import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { FriendshipResponseDto } from "../model/dto/response/friendship-response.dto";

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  constructor(private readonly http: HttpClient) { }

  // afficher les amis
  getFriendship(userId: string): Observable<FriendshipResponseDto[]> {
    return this.http.get<FriendshipResponseDto[]>(`${environment.coreURL}/friendship/${userId}`);
  }

  // accepter une demande d'ami
  acceptFriendship(friendId: string): Observable<void> {
    return this.http.post<void>(`${environment.coreURL}/friendship/ACCEPT/${friendId}`, {});
  }

  // refuser une demande d'ami
  rejectFriendship(friendId: string): Observable<void> {
    return this.http.post<void>(`${environment.coreURL}/friendship/REJECT/${friendId}`, {});
  }
}
