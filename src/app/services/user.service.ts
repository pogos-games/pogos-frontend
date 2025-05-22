import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";
import { UpdateUserRequestDto } from "../model/dto/request/update-user-request.dto";
import { UpdateUserResponseDto } from "../model/dto/response/update-user-response.dto";
import { SelfResponseDto } from '../model/dto/response/self-response.dto';
import { PageResponseDto } from '../model/dto/response/page-response.dto';

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

  getUserByName(
    username: string,
    page: number = 1,
    take: number = 10
  ): Observable<PageResponseDto<SelfResponseDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('take', take.toString());

    return this.http.get<PageResponseDto<SelfResponseDto>>(
      `${environment.coreURL}/users/username/${username}`,
      { params }
    );
  }
}
