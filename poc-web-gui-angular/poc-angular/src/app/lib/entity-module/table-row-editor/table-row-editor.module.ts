import {NgModule} from '@angular/core';
import {EditorRowComponent} from "./editor-row.component";
import {FilterRowComponent} from "./filter-row.component";
import {EntityCommonModule} from "../common/entity-common.module";
import {EntityMaterialModule} from "../common/entity-material.module";
import {EntityEditorActionsComponent} from "./entity-editor-actions.component";


@NgModule({
  imports: [
    EntityCommonModule,
    EntityMaterialModule
  ],
  declarations: [
    EditorRowComponent,
    FilterRowComponent,
    EntityEditorActionsComponent
  ],
  entryComponents: [
    EditorRowComponent,
    FilterRowComponent,
    EntityEditorActionsComponent
  ],
  exports: [
    EditorRowComponent,
    FilterRowComponent,
    EntityEditorActionsComponent
  ]
})
export class TableRowEditorModule {
}
