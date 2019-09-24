import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {EntityCommonModule} from "./common/entity-common.module";
import {EntityMaterialModule} from "./common/entity-material.module";

import {TableRowEditorModule} from "./table-row-editor/table-row-editor.module";
import {DialogModule} from "./dialog/dialog.module";

import {NGridModule} from "../../core/n-grid/n-grid.module";
import {EntityComponentStyleOverrideDirective} from "./entity-component-style-override.directive";


@NgModule({
  imports: [
    CommonModule,
    EntityCommonModule,
    EntityMaterialModule,
    TableRowEditorModule,
    DialogModule,

    NGridModule
  ],
  exports: [
    EntityCommonModule,
    EntityMaterialModule,
    TableRowEditorModule,
    DialogModule,

    NGridModule
  ],
  declarations: [
    EntityComponentStyleOverrideDirective
  ]
})

export class EntityModule {
}
