import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookiesStorageService {

  constructor(private cookieService: CookieService) { }

  setCookie(name: string, value: string, days: number): void {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (days * 24 * 60 * 60 * 1000));
    this.cookieService.set(name, value, expiryDate);
    console.log("get cookie : ", this.getCookie(name));
  }

  getCookie(name: string): string | null {
    return this.cookieService.get(name);
  }

  deleteCookie(name: string): void {
    this.cookieService.delete(name);
  }
}
