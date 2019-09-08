import {NgModule} from '@angular/core';
import {EntityCommonModule} from "../entity-common.module";
import {EditorRowComponent} from "./editor-row.component";
import {FilterRowComponent} from "./filter-row.component";


@NgModule({
  imports: [
    EntityCommonModule
  ],
  declarations: [
    EditorRowComponent,
    FilterRowComponent
  ],
  entryComponents: [
    EditorRowComponent,
    FilterRowComponent
  ],
  exports: [
    EditorRowComponent,
    FilterRowComponent]
})
export class TableRowEditorModule {
}
