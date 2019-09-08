import {NgModule} from '@angular/core';
import {APP_BASE_HREF} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material";
import {MomentDateAdapter} from "@angular/material-moment-adapter";

import {EntityCommonModule} from "./lib/entity-module/entity-common.module";
import {TableRowEditorModule} from "./lib/entity-module/table-row-editor/table-row-editor-module";
import {AuthGuardService, AuthModule, AuthService} from "./lib/auth-module/";

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {Constants, POC_DATE_FORMATS} from "../constants";
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

    EntityCommonModule,
    TableRowEditorModule,

    AuthModule,

    HomeModule,
    InfoModule,
    PersonModule,
    OrganizationModule
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
