import {NgModule} from '@angular/core';
import {EntityCommonModule} from "../entity-common.module";
import {FilterRowComponent} from "./filter-row/filter-row.component";


@NgModule({
  imports: [
    EntityCommonModule
  ],
  declarations: [
    FilterRowComponent
  ],
  entryComponents: [
    FilterRowComponent
  ],
  exports: [
    FilterRowComponent]
})
export class TableFilterModule {
}
