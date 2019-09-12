import {NgModule} from '@angular/core';
import {APP_BASE_HREF} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material";
import {MomentDateAdapter} from "@angular/material-moment-adapter";

import {MaterialModule} from './material.module';
import {AuthGuardService, AuthModule, AuthService} from "./lib/auth-module/";

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {Constants, POC_DATE_FORMATS} from "../constants";
import {EntityServicesModule} from "./core/service/entity-services.module";

import {HomeModule} from "./home/home.module";
import {InfoModule} from "./info/info.module";

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
    {provide: APP_BASE_HREF, useValue: Constants.applicationBasePath},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: POC_DATE_FORMATS},

    AuthGuardService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
