import {KeycloakService} from "keycloak-angular";
import {isPlatformBrowser} from "@angular/common";

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8180/keycloak',
        realm: 'master',
        clientId: 'pogos-frontend'
      },
      loadUserProfileAtStartUp: true,
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      }
    });
}

