import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly http:HttpClient) { }

  usernameExists(username:string) : Observable<boolean> {
      return this.http.get<boolean>(`${environment.coreURL}/users/exists/${username}`);
  }

}
