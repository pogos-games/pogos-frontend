import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from '../../services/storage/session-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private readonly StorageService: StorageService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.StorageService.getUserStorage()?.accessToken;

        // Ajoute le token à la requête si disponible
        const authReq = token
            ? req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            })
            : req;

        // Passe la requête au prochain gestionnaire
        return next.handle(authReq).pipe(
            catchError((error) => {
                console.error('HTTP Error:', error);

                // Gère une éventuelle expiration de session
                if (error.status === 401) {
                    //this.userService.logout(); // Déconnecte l'utilisateur si le token est invalide
                }

                return throwError(() => error);
            })
        );
    }
}
