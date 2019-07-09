import {NgModule} from '@angular/core';
import {APP_BASE_HREF} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {Constants} from "../constants";
import {AuthModule, AuthGuardService, AuthService} from "./lib/auth-module/";

import {HomeModule} from "./home/home.module";
import {InfoModule} from "./info/info.module";
import {OrganizationModule} from "./organizations/organization.module";
import {PersonModule} from "./people/person.module";




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    MaterialModule,
    BrowserAnimationsModule,

    AuthModule,

    HomeModule,
    InfoModule,
    PersonModule,
    OrganizationModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: Constants.applicationBasePath},
    AuthGuardService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

