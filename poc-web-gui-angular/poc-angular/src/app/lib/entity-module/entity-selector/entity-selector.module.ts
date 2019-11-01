import {NgModule} from '@angular/core';
import {EntityCommonModule} from "../common/entity-common.module";
import {EntityMaterialModule} from "../common/entity-material.module";
import {EntitySelectorComponent} from "./entity-selector.component";


@NgModule({
  imports: [
    EntityCommonModule,
    EntityMaterialModule
  ],
  declarations: [
    EntitySelectorComponent
  ],
  entryComponents: [
    EntitySelectorComponent
  ],
  exports: [
    EntitySelectorComponent
  ]
})
export class EntitySelectorModule {
}
