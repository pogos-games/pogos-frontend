import {ApplicationConfig, importProvidersFrom, provideAppInitializer} from '@angular/core';
import {provideRouter} from '@angular/router';

import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {routes} from './app.routes';
import {fr_FR, provideNzI18n} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import fr from '@angular/common/locales/fr';
import {FormsModule} from '@angular/forms';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideNzIcons, provideNzIcons as provideNzIcons_alias} from 'ng-zorro-antd/icon';
import {icons} from './icons-provider'
import {AuthInterceptor} from './auth/interceptor/auth.interceptor';
import {ConfigService} from "./services/config.service";
import {appInit} from "./app.init";
import {ThemeService} from "./services/theme.service";

registerLocaleData(fr);

// import all icons (bad)
//import * as AllIcons from '@ant-design/icons-angular/icons';
//import {IconDefinition} from '@ant-design/icons-angular';
// const antDesignIcons = AllIcons as {
//   [key: string]: IconDefinition;
// };
// const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])
//

export const appConfig: ApplicationConfig = {
  providers: [
    ConfigService,
    ThemeService,
    provideAppInitializer(appInit),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideRouter(routes),
    provideNzIcons(icons),
    provideNzI18n(fr_FR),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()), provideNzIcons_alias(icons)],
};
