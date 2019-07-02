import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {CdkTableModule} from "@angular/cdk/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../material.module";


@NgModule({
  imports: [
    CommonModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class EntityCommonModule {
}


