import {NgModule} from '@angular/core';

import {HomeComponent} from './home.component';
import {MaterialModule} from "../material.module";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    HomeComponent
  ],
  entryComponents: [
    HomeComponent
  ],
  providers: []
})
export class HomeModule {
}
