import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ConfigService} from "./config.service";
import {Observable} from "rxjs";
import {PageResponseDto} from "../model/dto/response/page-response.dto";
import {GameHistoryResponse} from "../model/dto/response/game-history-response.interface";

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private readonly httpClient = inject(HttpClient);

  private readonly configService = inject(ConfigService);

  private readonly CORE_URL = this.configService.config.CORE_URL;

  public findHistoryByUserId(userId: string, page: number = 1, take: number = 10): Observable<PageResponseDto<GameHistoryResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('take', take.toString());
    return this.httpClient.get<PageResponseDto<GameHistoryResponse>>(`${this.CORE_URL}/history/${userId}/?order=DESC`, {params});
  }

}
