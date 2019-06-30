import {NgModule} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {AuthGuardService} from "./lib/auth-module/auth-guard.service";
import {AuthService} from "./lib/auth-module/auth.service";
import {AuthModule} from "./lib/auth-module/auth.module";

import {HomeModule} from "./home/home.module";
import {PeopleModule} from "./people/people.module";


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
    PeopleModule
  ],
  providers: [AuthGuardService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

