import { Injectable } from '@angular/core';
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
import { UserService } from '../user.service';
import { Avatar } from '../../model/enum/avatar.enum';
import { SelfResponseDto } from '../../model/dto/response/self-response.dto';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private _user: User | undefined;

  private userTokenExpirationDate: Date | undefined;

  private readonly USER__SESSION_STORAGE_NAME = "USER";
  private readonly REFRESH_TOKEN_COOKIE_NAME = "pogos-refreshToken";

  constructor(private readonly authService: AuthService,
    private readonly storageService: SessionStorageService,
    private readonly cookiesStorageService: CookiesStorageService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService) {

    this._user = this.storageService.getItem<User>(this.USER__SESSION_STORAGE_NAME);

    if (this._user) {
      const userAccessToken = this.jwtService.decodeToken(this._user.accessToken);
      this.userTokenExpirationDate = this.jwtService.getTokenExpirationDate(userAccessToken.exp);
    }
  }

  get user(): User {
    if (!this._user) {
      throw new Error("User is undefined");
    }
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
    return this._user?.pseudo
  }

  // will be used later
  getUserId(): string | undefined {
    return this._user?.id;
  }

  getAccessToken(): string {
    if (!this._user?.accessToken) {
      throw new Error("Access token is undefined");
    }
    return this._user.accessToken;
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
    return this._user?.avatar;
  }

  updateAvatar(avatar: Avatar): void {
    if (!this._user) {
      throw new Error("User is undefined");
    }
    this._user.avatar = avatar;
    this.storageService.setItem<User>(this.USER__SESSION_STORAGE_NAME, this._user);
  }

  updateProfile(pseudo: string, avatar: Avatar): Observable<boolean> {
    if (!this._user) {
      return of(false);
    }

    const updateUserRequest: UpdateUserRequestDto = { username: pseudo, avatar: avatar };

    return this.userService.updateProfile(this._user?.id, updateUserRequest).pipe(
      map((response: UpdateUserResponseDto) => {
        if (this._user) {
          this._user.pseudo = response.username;
          this._user.avatar = response.avatar;
          this.storageService.setItem<User>(this.USER__SESSION_STORAGE_NAME, this._user);
        }
        return true;
      }),
      catchError((error) => {
        console.error('Error updating profile:', error);
        return of(false);
      })
    );
  }


  login(accessToken: string, refreshToken: string): void {
    const jwtResponse: DecodedJwt = this.jwtService.decodeToken(accessToken);
    this.userTokenExpirationDate = this.jwtService.getTokenExpirationDate(jwtResponse.exp);

    this._user = {
      id: '',
      pseudo: '',
      mail: jwtResponse.email,
      avatar: Avatar.DEFAULT,
      nbNotifications: 0,
      accessToken: accessToken,
    };

    this.storageService.setItem<User>(this.USER__SESSION_STORAGE_NAME, this._user);

    this.userService.self().subscribe({
      next: (selfResponse: SelfResponseDto) => {
        this._user = {
          accessToken: accessToken,
          mail: jwtResponse.email,
          id: selfResponse.id,
          pseudo: selfResponse.username,
          avatar: selfResponse.avatar,
          nbNotifications: selfResponse.nbNotifications,
        };

        this.storageService.setItem<User>(this.USER__SESSION_STORAGE_NAME, this._user);
      },
      error: (error) => {
        console.error('Erreur lors de l’appel à self():', error);
      },
    });

    const jwtRefreshToken: DecodedJwt = this.jwtService.decodeToken(refreshToken);
    const refreshTokenExpiration = this.jwtService.getTokenExpirationDate(jwtRefreshToken.exp);

    this.cookiesStorageService.setCookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshTokenExpiration);
  }


  logout(): void {
    this._user = undefined;
    this.userTokenExpirationDate = undefined;
    this.storageService.removeItem(this.USER__SESSION_STORAGE_NAME);
    this.cookiesStorageService.deleteCookie(this.REFRESH_TOKEN_COOKIE_NAME);
  }


}
