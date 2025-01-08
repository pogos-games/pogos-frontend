import { Injectable } from '@angular/core';
import { User } from '../../model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // Get the user from the local storage
  getUserStorage(): User {
    return JSON.parse(sessionStorage.getItem('user') as string);
  }

  // Set the user in the local storage
  setUserStorage(user: User): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  // Remove the user from the local storage
  removeUserStorage(): void {
    sessionStorage.removeItem('user');
  }
}
