import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AuthResponseDto } from "../../model/dto/response/auth-response.dto";
import { Observable } from "rxjs";
import { LoginRequestDto } from "../../model/dto/request/login-request.dto";
import { SignupRequestDto } from "../../model/dto/request/signup-request.dto";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3001';

  constructor(private readonly httpClient: HttpClient) { }

  login(loginRequest: LoginRequestDto): Observable<AuthResponseDto> {
    return this.httpClient.post<AuthResponseDto>(`${this.apiUrl}/auth/login`, loginRequest);
  }

  signup(signupRequest: SignupRequestDto): Observable<AuthResponseDto> {
    return this.httpClient.post<AuthResponseDto>(`${this.apiUrl}/auth/signup`, signupRequest);
  }

  refreshToken(refreshToken: string): Observable<AuthResponseDto> {
    return this.httpClient.post<AuthResponseDto>(`${this.apiUrl}/auth/refresh`, { refreshToken });
  }

}
