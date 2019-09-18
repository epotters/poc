import {NgModule} from '@angular/core';
import {EditorRowComponent} from "./editor-row.component";
import {FilterRowComponent} from "./filter-row.component";
import {EntityCommonModule} from "../common/entity-common.module";
import {EntityMaterialModule} from "../common/entity-material.module";


@NgModule({
  imports: [
    EntityCommonModule,
    EntityMaterialModule
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
    FilterRowComponent
  ]
})
export class TableRowEditorModule {
}
