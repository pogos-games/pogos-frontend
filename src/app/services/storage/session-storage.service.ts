import { Injectable } from '@angular/core';
import { User } from '../../model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  getItem<T>(key:string): T | undefined {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) as T : undefined;
  }

  setItem<T>(key:string, value:T) {
    sessionStorage.setItem(key,JSON.stringify(value))
  }

  removeItem(key:string) {
    sessionStorage.removeItem(key)
  }

}
