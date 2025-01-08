import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AuthResponseDto } from "../../model/auth-response.dto";
import { Observable } from "rxjs";
import { LoginRequestDto } from "../../model/dto/request/login-request.dto";
import { SignupRequestDto } from "../../model/dto/request/signup-request.dto";
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly httpClient: HttpClient) { }

  login(loginRequest: LoginRequestDto): Observable<AuthResponseDto> {
    return this.httpClient.post<AuthResponseDto>(`${environment.coreURL}/auth/login`, loginRequest);
  }

  signup(signupRequest: SignupRequestDto): Observable<AuthResponseDto> {
    return this.httpClient.post<AuthResponseDto>(`${environment.coreURL}/auth/signup`, signupRequest);
  }

  refreshToken(refreshToken: string): Observable<AuthResponseDto> {
    return this.httpClient.post<AuthResponseDto>(`${environment.coreURL}/auth/refresh`, { refreshToken });
  }

}
