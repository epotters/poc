import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {EntityCommonModule} from "./common/entity-common.module";
import {EntityMaterialModule} from "./common/entity-material.module";

import {TableRowEditorModule} from "./table-row-editor/table-row-editor.module";
import {DialogModule} from "./dialog/dialog.module";

import {EntityComponentStyleOverrideDirective} from "./common/entity-component-style-override.directive";
import {EntityLinkDirective} from "./common/entity-link.directive";
import {EntitySelectorModule} from "./entity-selector/entity-selector.module";


@NgModule({
  imports: [
    CommonModule,
    EntityCommonModule,
    EntityMaterialModule,
    TableRowEditorModule,
    EntitySelectorModule,
    DialogModule
  ],
  exports: [
    EntityCommonModule,
    EntityMaterialModule,
    TableRowEditorModule,
    EntitySelectorModule,
    DialogModule
  ],
  declarations: [
    EntityComponentStyleOverrideDirective,
    EntityLinkDirective
  ]
})

export class EntityModule {
}
