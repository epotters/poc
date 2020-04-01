import {APP_INITIALIZER, NgModule} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MaterialModule} from './material.module';
import {AuthGuardService, AuthModule, AuthService} from './lib/auth-lib/';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ConfigService, initApp} from './app-config.service';
import {EntityServicesModule} from './core/service/entity-services.module';

import {HomeModule} from './home/home.module';
import {InfoModule} from './info/info.module';
import {ErrorModule} from './core/error/error.module';
import {HttpErrorInterceptor} from './core/error/error.interceptor';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,

    MaterialModule,
    AppRoutingModule,
    ErrorModule.forRoot(),
    AuthModule,
    EntityServicesModule,

    HomeModule,
    InfoModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [HttpClient, ConfigService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: APP_BASE_HREF,
      deps: [ConfigService],
      useFactory: (config: ConfigService) => config.applicationBasePath
    },
    AuthGuardService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

