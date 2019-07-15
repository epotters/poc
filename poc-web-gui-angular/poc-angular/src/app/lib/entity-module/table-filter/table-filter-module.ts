import {NgModule} from '@angular/core';
import {FilterCellComponent} from "./components/filter-template/filter-cell.component";
import {TableFilterDirective} from "./directives/table-filter.directive";
import {EntityCommonModule} from "../entity-common.module";


@NgModule({
  imports: [
    EntityCommonModule
  ],
  declarations: [
    FilterCellComponent,
    TableFilterDirective
  ],
  entryComponents: [
    FilterCellComponent
  ],
  exports: [
    FilterCellComponent,
    TableFilterDirective
  ]
})
export class TableFilterModule {
}
