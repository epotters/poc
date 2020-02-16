import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {EntityCommonModule} from "./common/entity-common.module";
import {EntityMaterialModule} from "./common/entity-material.module";

import {TableRowEditorModule} from "./table-row-editor/table-row-editor.module";
import {EntitySelectorModule} from "./entity-selector/entity-selector.module";
import {DialogModule} from "./dialog/dialog.module";

import {EntityComponentStyleOverrideDirective} from "./common/entity-component-style-override.directive";
import {EntityLinkDirective} from "./common/entity-link.directive";

import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  imports: [
    CommonModule,
    EntityCommonModule,
    EntityMaterialModule,
    TableRowEditorModule,
    EntitySelectorModule,
    DialogModule,

    NgSelectModule
  ],
  exports: [
    EntityCommonModule,
    EntityMaterialModule,
    TableRowEditorModule,
    EntitySelectorModule,
    DialogModule,

    NgSelectModule
  ],
  declarations: [
    EntityComponentStyleOverrideDirective,
    EntityLinkDirective
  ]
})

export class EntityModule {
}
