import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { UserAuthService } from "../../services/auth/user-auth.service";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isUserLoggedIn = this.userAuthService.isUserLoggedIn();
    if (isUserLoggedIn) {
      return true;
    } else {
      return this.userAuthService.updateToken().pipe(
        map((tokenRefreshed: boolean) => tokenRefreshed),
        catchError(() => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }
  }
}
