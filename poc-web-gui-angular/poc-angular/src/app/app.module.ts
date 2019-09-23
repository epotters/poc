import {APP_INITIALIZER, NgModule} from '@angular/core';
import {APP_BASE_HREF} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {Observable, ObservableInput, of} from "rxjs";
import {catchError, map} from "rxjs/operators";

import {MaterialModule} from './material.module';
import {AuthGuardService, AuthModule, AuthService} from "./lib/auth-module/";

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {Constants} from "../constants";
import {ConfigService} from "./app-config.service";
import {EntityServicesModule} from "./core/service/entity-services.module";

import {HomeModule} from "./home/home.module";
import {InfoModule} from "./info/info.module";


export interface AppInitialConfig {
  baseUrl: String;
}

// Source: https://davembush.github.io/where-to-store-angular-configurations/
export function initApp(http: HttpClient, config: ConfigService): (() => Promise<boolean>) {
  console.debug('Trying to load the application configuration config.json before the app starts');
  return (): Promise<boolean> => {
    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
      http.get('./config.json')
        .pipe(
          map((x: ConfigService) => {
            console.debug('Received config.json');
            config.baseUrl = x.baseUrl;
            resolve(true);
          }),
          catchError((error: { status: number }, caught: Observable<void>): ObservableInput<{}> => {
            if (error.status !== 404) {
              console.debug('Configuration file config.json was not found');
              resolve(false);
            }
            config.baseUrl = Constants.apiRoot;
            resolve(true);
            return of({});
          })
        ).subscribe();
    });
  };
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,

    MaterialModule,
    AppRoutingModule,
    AuthModule,
    EntityServicesModule,

    HomeModule,
    InfoModule
  ],
  providers: [
    {provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [
        HttpClient,
        ConfigService
      ], multi: true},
    {provide: APP_BASE_HREF, useValue: Constants.applicationBasePath},
    AuthGuardService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
