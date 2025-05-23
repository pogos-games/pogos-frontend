import { inject, Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { UpdateUserRequestDto } from "../model/dto/request/update-user-request.dto";
import { UpdateUserResponseDto } from "../model/dto/response/update-user-response.dto";
import { SelfResponseDto } from '../model/dto/response/self-response.dto';
import { ConfigService } from "./config.service";
import { HttpClient } from "@angular/common/http";
import { HttpParams } from "@angular/common/http";
import { PageResponseDto } from '../model/dto/response/page-response.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly configService = inject(ConfigService);

  private readonly httpClient: HttpClient = inject(HttpClient);

  private readonly CORE_URL = this.configService.config.CORE_URL;

  self(): Observable<SelfResponseDto> {
    return this.httpClient.get<SelfResponseDto>(`${this.CORE_URL}/users/self`);
  }

  usernameExists(username: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.CORE_URL}/users/exists/${username}`);
  }

  updateProfile(userId: string, updateUserRequest: UpdateUserRequestDto): Observable<UpdateUserResponseDto> {
    return this.httpClient.put<UpdateUserResponseDto>(`${this.CORE_URL}/users/${userId}`, updateUserRequest);
  }

  getUserByName(
    username: string,
    page: number = 1,
    take: number = 10
  ): Observable<PageResponseDto<SelfResponseDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('take', take.toString());

    return this.httpClient.get<PageResponseDto<SelfResponseDto>>(
      `${this.CORE_URL}/users/username/${username}`,
      { params }
    );
  }
}
