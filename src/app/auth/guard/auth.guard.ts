import {Injectable} from "@angular/core";
import {KeycloakAuthGuard, KeycloakEventType, KeycloakService} from "keycloak-angular";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {

  constructor(
    protected override readonly router: Router,
    protected readonly keycloakService: KeycloakService,
  ) {
    super(router,keycloakService)

    keycloakService.keycloakEvents$.subscribe({
      next(event) {
        if (event.type == KeycloakEventType.OnTokenExpired) {
          keycloakService.updateToken(20).then(r => {
            // disable in production
            console.log('Token updated');
          });
        }
      }
    });
  }

  async isAccessAllowed(){

    if (!this.authenticated) {
        await this.keycloakService.login({
          redirectUri: window.location.toString() + '/profile',
        });
      }
      return this.authenticated;
  }


}
