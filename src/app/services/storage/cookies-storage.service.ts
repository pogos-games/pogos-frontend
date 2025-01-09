import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CookiesStorageService {
  constructor(private cookieService: CookieService) { }

  /**
   * Définit un cookie avec une date d'expiration spécifique.
   * @param name Nom du cookie.
   * @param value Valeur du cookie.
   * @param expires Date d'expiration.
   * @param path Chemin où le cookie sera accessible (par défaut '/').
   * @param secure Définit si le cookie est sécurisé (HTTPS uniquement).
   */
  setCookie(name: string, value: string, expires: Date, path: string = '/', secure: boolean = false): void {
    this.cookieService.set(name, value, expires, path, undefined, secure, 'Strict');
  }

  /**
   * Récupère la valeur d'un cookie.
   * @param name Nom du cookie.
   * @returns Valeur du cookie ou null si inexistant.
   */
  getCookie(name: string): string | undefined {
    return this.cookieService.get(name) || undefined;
  }

  /**
   * Supprime un cookie.
   * @param name Nom du cookie.
   * @param path Chemin où le cookie est accessible (par défaut '/').
   */
  deleteCookie(name: string, path: string = '/'): void {
    this.cookieService.delete(name, path);
  }
}
