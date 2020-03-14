import {NgModule} from '@angular/core';
import {EntityCommonModule} from "../common/entity-common.module";
import {EntityMaterialModule} from "../common/entity-material.module";
import {EntitySelectorComponent} from "./entity-selector.component";
import {EntitySelectorListComponent} from "./entity-selector-list.component";
import {DialogModule} from "../dialog/dialog.module";


@NgModule({
  imports: [
    EntityCommonModule,
    EntityMaterialModule,
    DialogModule
  ],
  declarations: [
    EntitySelectorComponent,
    EntitySelectorListComponent
  ],
  entryComponents: [
    EntitySelectorComponent,
    EntitySelectorListComponent
  ],
  exports: [
    EntitySelectorComponent,
    EntitySelectorListComponent
  ]
})
export class EntitySelectorModule {
}
