import {NgModule} from '@angular/core';
import {EditorRowComponent} from "./editor-row.component";
import {FilterRowComponent} from "./filter-row.component";
import {EntityCommonModule} from "../common/entity-common.module";
import {EntityMaterialModule} from "../common/entity-material.module";
import {EntityEditorActionsComponent} from "./entity-editor-actions.component";
import {EntitySelectorModule} from "../entity-selector/entity-selector.module";
import {EditorFieldComponent} from "./editor-field.component";


@NgModule({
  imports: [
    EntityCommonModule,
    EntityMaterialModule,
    EntitySelectorModule
  ],
  declarations: [
    EditorRowComponent,
    FilterRowComponent,
    EntityEditorActionsComponent,
    EditorFieldComponent
  ],
  entryComponents: [
    EditorRowComponent,
    FilterRowComponent,
    EntityEditorActionsComponent,
    EditorFieldComponent
  ],
  exports: [
    EditorRowComponent,
    FilterRowComponent,
    EntityEditorActionsComponent,
    EditorFieldComponent
  ]
})
export class TableRowEditorModule {
}
