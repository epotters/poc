import {NgModule} from '@angular/core';

import {InfoComponent} from './info.component';
import {MaterialModule} from '../material.module';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    InfoComponent
  ],
  entryComponents: [
    InfoComponent
  ],
  providers: []
})
export class InfoModule {
}
