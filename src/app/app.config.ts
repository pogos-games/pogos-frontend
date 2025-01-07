import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { fr_FR, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideNzIcons, provideNzIcons as provideNzIcons_alias } from 'ng-zorro-antd/icon';
import { icons } from './icons-provider'
import { AuthInterceptor } from './auth/interceptor/auth.interceptor';

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
    provideHttpClient(), provideNzIcons_alias(icons)],
};
