import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthResponseDto} from "../../model/dto/response/auth-response.dto";
import {Observable} from "rxjs";
import {LoginRequestDto} from "../../model/dto/request/login-request.dto";
import {SignupRequestDto} from "../../model/dto/request/signup-request.dto";
import {ConfigService} from "../../services/config.service";
import {PasswordUpdateRequest} from "../../model/dto/request/password-update-request.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly httpClient: HttpClient = inject(HttpClient);

  private readonly configService = inject(ConfigService);

  private readonly CORE_URL = this.configService.config.CORE_URL;

  login(loginRequest: LoginRequestDto): Observable<AuthResponseDto> {
    return this.httpClient.post<AuthResponseDto>(`${this.CORE_URL}/auth/login`, loginRequest);
  }

  signup(signupRequest: SignupRequestDto): Observable<AuthResponseDto> {
    return this.httpClient.post<AuthResponseDto>(`${this.CORE_URL}/auth/signup`, signupRequest);
  }

  refreshToken(refreshToken: string): Observable<AuthResponseDto> {
    return this.httpClient.post<AuthResponseDto>(`${this.CORE_URL}/auth/refresh`, { refreshToken });
  }

  updatePassword(passwordUpdateRequest: PasswordUpdateRequest) : Observable<void> {
    return this.httpClient.post<void>(`${this.CORE_URL}/auth/password`, passwordUpdateRequest);
  }
}
