import {NgModule} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {BrowserModule} from "@angular/platform-browser";

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeModule} from "./home/home.module";
import {PeopleModule} from "./people/people.module";

import {AuthGuardService} from "./core/service/auth-guard.service";
import {AuthService} from "./core/service/auth.service";
import {AuthCallbackModule} from "./auth-callback/auth-callback.module";


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

    AuthCallbackModule,

    HomeModule,
    PeopleModule

  ],
  providers: [AuthGuardService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

