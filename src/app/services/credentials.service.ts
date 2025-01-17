import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {
  private accessTokenKey = '';
  private refreshTokenKey = '';
  isUserLoggedIn = false;

  constructor(private http: HttpClient) {}

  login(username:string, password:string) {

  }

}
