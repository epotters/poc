import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {CdkTableModule} from "@angular/cdk/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  imports: [
    CommonModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [],
  entryComponents: []
})
export class EntityCommonModule {
}
