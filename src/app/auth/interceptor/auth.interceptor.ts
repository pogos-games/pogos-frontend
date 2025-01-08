import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage/session-storage.service';
import { JwtService } from '../../services/jwt.service';
import { AuthService } from '../service/auth.service';
import { CookiesStorageService } from '../../services/storage/cookies-storage.service';
import { User } from '../../model/user.interface';
import { PublicEndPoint } from '../../model/enum/public-endpoint.enum';

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
        // Bypass pour les endpoints publics
        if (this.isPublicEndpoint(req.url)) {
            return next.handle(req);
        }

        return this.handleTokenValidation(req, next);
    }

    /**
     * Vérifie si l'URL est un endpoint public.
     */
    private isPublicEndpoint(url: string): boolean {
        const publicEndpoints: string[] = Object.values(PublicEndPoint);
        return publicEndpoints.some(endpoint => url.includes(endpoint));
    }

    /**
     * Gère la validation des tokens et rafraîchit si nécessaire.
     */
    private handleTokenValidation(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.storageService.getUserStorage()?.accessToken;
        const refreshToken = this.cookiesStorageService.getCookie('pogos-refreshToken') ?? '';

        const isAccessTokenValid = this.jwtService.isTokenValid(accessToken);
        const isRefreshTokenValid = this.jwtService.isTokenValid(refreshToken);

        if (isAccessTokenValid) {
            return this.sendRequestWithToken(req, next, accessToken);
        } else if (isRefreshTokenValid) {
            return this.refreshTokenAndRetry(req, next, refreshToken);
        } else {
            this.logoutAndRedirect();
            return throwError(() => new Error('Session expirée - veuillez vous reconnecter'));
        }
    }

    /**
     * Rafraîchit le token et réessaie la requête originale.
     */
    private refreshTokenAndRetry(req: HttpRequest<any>, next: HttpHandler, refreshToken: string): Observable<HttpEvent<any>> {
        return this.authService.refreshToken(refreshToken).pipe(
            switchMap((response) => {
                const user = this.storageService.getUserStorage();
                const newUser: User = { ...user, accessToken: response.accessToken };
                this.storageService.setUserStorage(newUser);

                return this.sendRequestWithToken(req, next, response.accessToken);
            }),
            catchError((error) => {
                this.logoutAndRedirect();
                return throwError(() => error);
            })
        );
    }

    /**
     * Ajoute le token à l'en-tête et envoie la requête.
     */
    private sendRequestWithToken(req: HttpRequest<any>, next: HttpHandler, token: string): Observable<HttpEvent<any>> {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
        return next.handle(authReq);
    }

    /**
     * Déconnecte l'utilisateur et redirige vers la page de connexion.
     */
    private logoutAndRedirect(): void {
        this.storageService.removeUserStorage();
        this.cookiesStorageService.deleteCookie('refreshToken');
        this.router.navigate(['/login']);
    }
}
