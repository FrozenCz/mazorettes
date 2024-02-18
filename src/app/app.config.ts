import {ApplicationConfig, importProvidersFrom, LOCALE_ID} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import {JwtModule} from '@auth0/angular-jwt';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {registerLocaleData} from '@angular/common';
import localeCs from '@angular/common/locales/cs';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

registerLocaleData(localeCs, 'cs');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    provideAnimations(),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["localhost"],
        },
      })
    ),
    {
      provide: LOCALE_ID,
      useValue: 'cs'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ]

};
