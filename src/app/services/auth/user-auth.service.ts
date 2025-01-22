import {Injectable, signal, WritableSignal} from '@angular/core';
import { SessionStorageService } from "../storage/session-storage.service";
import { CookiesStorageService } from "../storage/cookies-storage.service";
import { User } from "../../model/user.interface";
import { JwtService } from "../jwt.service";
import { DecodedJwt } from "../../model/decoded-jwt.interface";
import { AuthService } from "../../auth/service/auth.service";
import { catchError, map, Observable, of } from "rxjs";
import { AuthResponseDto } from "../../model/auth-response.dto";
import {Avatar} from "../../model/enum/avatar.enum";

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private _user: WritableSignal<User | undefined> = signal(undefined);
  //private _user: User | undefined;

  private userTokenExpirationDate: Date | undefined;

  private readonly USER__SESSION_STORAGE_NAME = "USER";
  private readonly REFRESH_TOKEN_COOKIE_NAME = "pogos-refreshToken";

  constructor(
    private readonly authService: AuthService,
    private readonly storageService: SessionStorageService,
    private readonly cookiesStorageService: CookiesStorageService,
    private readonly jwtService: JwtService
  ) {
    this._user.set(this.storageService.getItem<User>(this.USER__SESSION_STORAGE_NAME));

    const user = this._user();
    if (user) {
      const userAccessToken = this.jwtService.decodeToken(user.accessToken);
      this.userTokenExpirationDate = this.jwtService.getTokenExpirationDate(userAccessToken.exp);
    }
  }


  get user(): WritableSignal<User | undefined> {
    return this._user;
  }


    isUserLoggedIn(): boolean {

    if (!this.userTokenExpirationDate) {
      return false;
    }
    // check if token is not expired
    return this.userTokenExpirationDate > new Date();
  }

  getUsername() {
    return this._user()?.pseudo
  }

  // will be used later
  getUserId(): string | undefined {
    return this._user()?.userId;
  }

  getAccessToken(): string {
    const user = this._user();
    if (!user || !user.accessToken) {
      throw new Error("Access token is undefined");
    }
    return user.accessToken;
  }


  updateToken(): Observable<boolean> {
    const refreshToken = this.cookiesStorageService.getCookie(this.REFRESH_TOKEN_COOKIE_NAME);
    if (!refreshToken) {
      return of(false);
    }

    return this.authService.refreshToken(refreshToken).pipe(
      map((response: AuthResponseDto) => {
        this.login(response.accessToken, response.refreshToken);
        return true;
      }),
      catchError(error => {
        console.error('Error refreshing token:', error);
        return of(false);
      })
    );
  }

  getAvatar(): string | undefined {
    return this._user()?.avatar;
  }

  updateAvatar(avatar: string): void {
    const user = this._user(); // Récupère la valeur actuelle du signal
    if (!user) {
      throw new Error("User is undefined");
    }
    user.avatar = avatar;
    this._user.set(user);
    console.log('user avatar :',user.avatar)
    this.storageService.setItem<User>(this.USER__SESSION_STORAGE_NAME, user);
  }


  login(accessToken: string, refreshToken: string) {
    const jwtResponse: DecodedJwt = this.jwtService.decodeToken(accessToken)
    this.userTokenExpirationDate = this.jwtService.getTokenExpirationDate(jwtResponse.exp);

    const user: User = { pseudo: jwtResponse.username, mail: jwtResponse.email, accessToken: accessToken, userId: jwtResponse.sub, avatar: Avatar.DEFAULT};
    this._user.set(user)

    const jwtRefreshToken: DecodedJwt = this.jwtService.decodeToken(refreshToken);
    const refreshTokenExpiration = this.jwtService.getTokenExpirationDate(jwtRefreshToken.exp);

    this.storageService.setItem<User>(this.USER__SESSION_STORAGE_NAME, user);
    this.cookiesStorageService.setCookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshTokenExpiration);
  }

  logout(): void {
    this._user.set(undefined);
    this.userTokenExpirationDate = undefined;
    this.storageService.removeItem(this.USER__SESSION_STORAGE_NAME);
    this.cookiesStorageService.deleteCookie(this.REFRESH_TOKEN_COOKIE_NAME);
  }


}
