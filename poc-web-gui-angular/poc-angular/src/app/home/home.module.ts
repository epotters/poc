import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MaterialModule} from '../material.module';

import {HomeComponent} from './home.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    HomeComponent
  ],
  providers: []
})
export class HomeModule {
}
