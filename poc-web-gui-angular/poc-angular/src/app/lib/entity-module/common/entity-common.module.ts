import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CdkTableModule} from "@angular/cdk/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
    // BrowserAnimationsModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    // BrowserModule,
    // BrowserAnimationsModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [],
  entryComponents: []
})
export class EntityCommonModule {
}
