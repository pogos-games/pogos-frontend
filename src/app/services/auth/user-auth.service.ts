import {Injectable} from '@angular/core';
import {SessionStorageService} from "../storage/session-storage.service";
import {CookiesStorageService} from "../storage/cookies-storage.service";
import {User} from "../../model/user.interface";
import {JwtService} from "../jwt.service";
import {DecodedJwt} from "../../model/decoded-jwt.interface";
import {AuthService} from "../../auth/service/auth.service";
import {catchError, map, Observable, of} from "rxjs";
import {AuthResponseDto} from "../../model/auth-response.dto";

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private user:User|undefined;

  private userTokenExpirationDate: Date|undefined;

  private readonly USER__SESSION_STORAGE_NAME = "USER";
  private readonly REFRESH_TOKEN_COOKIE_NAME = "pogos-refreshToken";

  constructor(private readonly authService:AuthService,
                       private readonly storageService:SessionStorageService,
                       private readonly cookiesStorageService: CookiesStorageService,
                       private readonly jwtService:JwtService) {

   this.user = this.storageService.getItem<User>(this.USER__SESSION_STORAGE_NAME);

    if(this.user){
      const userAccessToken = this.jwtService.decodeToken(this.user.accessToken);
      this.userTokenExpirationDate = this.jwtService.getTokenExpirationDate(userAccessToken.exp);
    }
  }

  isUserLoggedIn() : boolean {

    if(!this.userTokenExpirationDate){
      return false;
    }
    // check if token is not expired
    return this.userTokenExpirationDate > new Date();
  }

  getUsername() {
    return this.user?.pseudo
  }

  // will be used later
  getUserId() : string | undefined {
    return this.user?.userId;
  }

  getAccessToken(): string {
    if (!this.user?.accessToken) {
      throw new Error("Access token is undefined");
    }
    return this.user.accessToken;
  }

  updateToken(): Observable<boolean> {
    const refreshToken = this.cookiesStorageService.getCookie(this.REFRESH_TOKEN_COOKIE_NAME);
    if (!refreshToken) {
      return of(false);
    }

    return this.authService.refreshToken(refreshToken).pipe(
      map((response: AuthResponseDto) => {
        this.login(response.accessToken,response.refreshToken);
        return true;
      }),
      catchError(error => {
        console.error('Error refreshing token:', error);
        return of(false);
      })
    );
  }

  login(accessToken:string, refreshToken:string) {
    const jwtResponse: DecodedJwt = this.jwtService.decodeToken(accessToken)
    this.userTokenExpirationDate = this.jwtService.getTokenExpirationDate(jwtResponse.exp);
    this.user = {pseudo:jwtResponse.username, mail:jwtResponse.email, accessToken:accessToken, userId:jwtResponse.sub};

    const jwtRefreshToken : DecodedJwt = this.jwtService.decodeToken(refreshToken);
    const refreshTokenExpiration = this.jwtService.getTokenExpirationDate(jwtRefreshToken.exp);

    this.storageService.setItem<User>(this.USER__SESSION_STORAGE_NAME,this.user);
    this.cookiesStorageService.setCookie(this.REFRESH_TOKEN_COOKIE_NAME,refreshToken, refreshTokenExpiration);
  }

  logout(): void {
    this.storageService.removeItem(this.USER__SESSION_STORAGE_NAME);
    this.cookiesStorageService.deleteCookie(this.REFRESH_TOKEN_COOKIE_NAME);
  }


}
