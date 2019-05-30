import {NgModule} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {BrowserModule} from "@angular/platform-browser";

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeModule} from "./home/home.module";
import {PeopleModule} from "./people/people.module";
import {CdkTableModule} from "@angular/cdk/table";


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

    HomeModule,
    PeopleModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

