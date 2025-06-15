import {inject, Injectable} from '@angular/core';
import {ConfigService} from "./config.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {UserResponseDto} from "../model/dto/response/user-response.dto";
import {Observable} from "rxjs";
import {PageResponseDto} from "../model/dto/response/page-response.dto";

@Injectable({
  providedIn: 'root'
})
export class RankingService {

  private readonly configService = inject(ConfigService);

  private readonly httpClient = inject(HttpClient);

  private readonly CORE_URL = this.configService.config.CORE_URL;

  getUsersByRanking(page: number = 1, take:number = 10): Observable<PageResponseDto<UserResponseDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('take', take.toString());
    return this.httpClient.get<PageResponseDto<UserResponseDto>>(`${this.CORE_URL}/ranking/users`, {params})
  }

}
