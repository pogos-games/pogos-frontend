import { Injectable, signal, WritableSignal } from '@angular/core';
import { SessionStorageService } from "../storage/session-storage.service";
import { CookiesStorageService } from "../storage/cookies-storage.service";
import { User } from "../../model/user.interface";
import { JwtService } from "../jwt.service";
import { DecodedJwt } from "../../model/decoded-jwt.interface";
import { AuthService } from "../../auth/service/auth.service";
import { catchError, map, Observable, of } from "rxjs";
import { AuthResponseDto } from "../../model/dto/response/auth-response.dto";
import { UpdateUserRequestDto } from '../../model/dto/request/update-user-request.dto';
import { UpdateUserResponseDto } from '../../model/dto/response/update-user-response.dto';
import { Avatar } from '../../model/dto/game/enum/avatar.enum';
import { SelfResponseDto } from '../../model/dto/response/self-response.dto';
import { UserService } from "../user.service";

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private readonly _user: WritableSignal<User> = signal({ accessToken: '', mail: '', id: '', pseudo: '', avatar: Avatar.DEFAULT, nbNotifications: 0 })
  public user = this._user.asReadonly();

  private userAccessToken: string | undefined;

  private userTokenExpirationDate: Date | undefined;

  private readonly USER__SESSION_STORAGE_NAME = "USER";
  private readonly REFRESH_TOKEN_COOKIE_NAME = "pogos-refreshToken";

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly storageService: SessionStorageService,
    private readonly cookiesStorageService: CookiesStorageService,
    private readonly jwtService: JwtService
  ) {

    const user = this.storageService.getItem<User>(this.USER__SESSION_STORAGE_NAME);

    if (user) {
      this._user.set(user);
      this.userAccessToken = user.accessToken;
      const userAccessToken = this.jwtService.decodeToken(user.accessToken);
      this.userTokenExpirationDate = this.jwtService.getTokenExpirationDate(userAccessToken.exp);
    }
  }

  isUserLoggedIn(): boolean {
    if (!this.userTokenExpirationDate) {
      return false;
    }
    // check if token is not expired
    return this.userTokenExpirationDate > new Date();
  }

  getAccessToken(): string {
    if (!this.userAccessToken) {
      throw new Error("Access token is undefined");
    }
    return this.userAccessToken;
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

  updateProfile(pseudo: string, avatar: Avatar): Observable<boolean> {

    const updateUserRequest: UpdateUserRequestDto = { username: pseudo, avatar: avatar };

    return this.userService.updateProfile(this.user().id, updateUserRequest).pipe(
      map((response: UpdateUserResponseDto) => {
        if (response) {
          const user = this.user()
          user.pseudo = response.username;
          user.avatar = response.avatar;
          this.storageService.setItem<User>(this.USER__SESSION_STORAGE_NAME, user);
          this._user.set(user);
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Error while updating profile:', error);
        return of(false);
      })
    );
  }

  login(accessToken: string, refreshToken: string): void {
    const jwtResponse: DecodedJwt = this.jwtService.decodeToken(accessToken);
    this.userTokenExpirationDate = this.jwtService.getTokenExpirationDate(jwtResponse.exp);
    this.userAccessToken = accessToken;

    const user: User = { pseudo: jwtResponse.username, mail: jwtResponse.email, accessToken: accessToken, id: jwtResponse.sub, avatar: Avatar.DEFAULT, nbNotifications: 0 };
    this._user.set(user)
    this.storageService.setItem<User>(this.USER__SESSION_STORAGE_NAME, user);

    this.userService.self().subscribe({
      next: (selfResponse: SelfResponseDto) => {
        const newUser: User = {
          accessToken: accessToken,
          mail: jwtResponse.email,
          id: selfResponse.id,
          pseudo: selfResponse.username,
          avatar: selfResponse.avatar,
          nbNotifications: selfResponse.nbNotifications,
        };
        this._user.set(newUser)
        this.storageService.setItem<User>(this.USER__SESSION_STORAGE_NAME, newUser);
      },
      error: (error) => {
        console.error('Erreur lors de l’appel à self():', error);
      },
    });

    const jwtRefreshToken: DecodedJwt = this.jwtService.decodeToken(refreshToken);
    const refreshTokenExpiration = this.jwtService.getTokenExpirationDate(jwtRefreshToken.exp);

    this.storageService.setItem<User>(this.USER__SESSION_STORAGE_NAME, user);
    this.cookiesStorageService.setCookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshTokenExpiration);
  }

  logout(): void {
    this._user.set({ accessToken: '', mail: '', id: '', pseudo: '', avatar: Avatar.DEFAULT, nbNotifications: 0 });
    this.userTokenExpirationDate = undefined;
    this.storageService.removeItem(this.USER__SESSION_STORAGE_NAME);
    this.cookiesStorageService.deleteCookie(this.REFRESH_TOKEN_COOKIE_NAME);
  }


}
