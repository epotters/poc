import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MaterialModule} from '../material.module';

import {InfoComponent} from './info.component';

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
