import {APP_BASE_HREF} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthConfigService, AuthGuardService, AuthModule, AuthService} from '@epotters/auth';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';

import {ConfigService, initApp} from './app-config.service';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpErrorInterceptor} from './core/error/error.interceptor';
import {ErrorModule} from './core/error/error.module';
import {EntityServicesModule} from './core/service/entity-services.module';
import {HomeModule} from './home/home.module';
import {InfoModule} from './info/info.module';

import {MaterialModule} from './material.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    LoggerModule.forRoot({
      level: NgxLoggerLevel.INFO
    }),
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
      provide: APP_BASE_HREF,
      deps: [ConfigService],
      useFactory: (config: ConfigService) => config.applicationBasePath
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {provide: AuthConfigService, useExisting: ConfigService},
    AuthService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

