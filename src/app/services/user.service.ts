import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";
import { UpdateUserRequestDto } from "../model/dto/request/update-user-request.dto";
import { UpdateUserResponseDto } from "../model/dto/response/update-user-response.dto";
import { SelfResponseDto } from '../model/dto/response/self-response.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly http: HttpClient) { }

  self(): Observable<SelfResponseDto> {
    return this.http.get<SelfResponseDto>(`${environment.coreURL}/users/self`);
  }

  usernameExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.coreURL}/users/exists/${username}`);
  }

  updateProfile(userId: string, updateUserRequest: UpdateUserRequestDto): Observable<UpdateUserResponseDto> {
    return this.http.put<UpdateUserResponseDto>(`${environment.coreURL}/users/${userId}`, updateUserRequest);
  }

}
