import { Injectable } from '@angular/core';
import * as Cookies from 'js-cookie';  // Importation de la bibliothèque js-cookie

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  constructor() { }

  // Set a cookie with a name, value and expiration date
  setCookie(name: string, value: string, days: number): void {
    const expires = days ? { expires: days } : undefined;
    Cookies.set(name, value, expires); // Utilisation de js-cookie pour définir le cookie
  }

  getCookie(name: string): string | undefined {
    return Cookies.get(name); // Utilisation de js-cookie pour récupérer le cookie
  }

  // Delete a cookie
  deleteCookie(name: string): void {
    Cookies.remove(name);  // Utilisation de js-cookie pour supprimer le cookie
  }
}
