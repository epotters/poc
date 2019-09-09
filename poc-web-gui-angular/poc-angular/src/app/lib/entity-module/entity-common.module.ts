import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CdkTableModule} from "@angular/cdk/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

// TODO: refactor dependency to be included in the library, not referencing the project
import {MaterialModule} from "../../material.module";


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    BrowserAnimationsModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [],
  entryComponents: []
})
export class EntityCommonModule {
}
