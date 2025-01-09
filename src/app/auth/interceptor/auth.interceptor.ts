import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {PublicEndPoint} from '../../model/enum/public-endpoint.enum';
import {UserAuthService} from "../../services/auth/user-auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private readonly userAuthService:UserAuthService,
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

        if (this.userAuthService.isUserLoggedIn()) {
            return this.sendRequestWithToken(req, next, this.userAuthService.getAccessToken());
        } else if (this.userAuthService.updateToken()) {
            return this.sendRequestWithToken(req, next, this.userAuthService.getAccessToken());
        } else {
            this.logoutAndRedirect();
            return throwError(() => new Error('Session expirée - veuillez vous reconnecter'));
        }
    }

    /**
     * Ajoute le token à l'en-tête et envoie la requête.
     */
    private sendRequestWithToken(req: HttpRequest<any>, next: HttpHandler, token: string): Observable<HttpEvent<any>> {
        const authReq = req.clone({
            setHeaders: {
                Authorization:  `Bearer ${token}`,
            },
        });
        return next.handle(authReq);
    }

    /**
     * Déconnecte l'utilisateur et redirige vers la page de connexion.
     */
    private logoutAndRedirect(): void {
        this.userAuthService.logout();
      this.router.navigateByUrl('/login');
    }
}
