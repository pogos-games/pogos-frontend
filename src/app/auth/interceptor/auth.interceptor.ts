import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpStatusCode,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage/session-storage.service';
import { JwtService } from '../../services/jwt.service';
import { AuthService } from '../service/auth.service';
import { CookiesStorageService } from '../../services/storage/cookies-storage.service';
import { User } from '../../model/user.interface';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private readonly storageService: StorageService,
        private readonly jwtService: JwtService,
        private readonly authService: AuthService,
        private readonly cookiesStorageService: CookiesStorageService,
        private readonly router: Router
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken: string = this.storageService.getUserStorage()?.accessToken;
        const refreshToken: string = this.cookiesStorageService.getCookie('refreshToken') ?? '';

        const isValidAccessToken: boolean = this.jwtService.isTokenValid(accessToken);
        const isValidRefreshToken: boolean = this.jwtService.isTokenValid(refreshToken);

        const authReq = accessToken
            ? req.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            : req;

        return next.handle(authReq).pipe(
            catchError((error) => {
                console.error('HTTP Error:', error);

                if (error.status === HttpStatusCode.Unauthorized) {
                    if (!isValidAccessToken) {
                        if (isValidRefreshToken) {
                            const user = this.storageService.getUserStorage();
                            this.authService.refreshToken(refreshToken).subscribe((response) => {
                                const newUser: User = { ...user, accessToken: response.accessToken };
                                this.storageService.setUserStorage(newUser);
                            });
                            return next.handle(authReq);
                        }

                        this.storageService.removeUserStorage();
                        this.cookiesStorageService.deleteCookie('refreshToken');
                        this.router.navigate(['/']);
                    }
                }

                return throwError(() => error);
            })
        );
    }
}
