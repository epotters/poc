import {NgModule} from '@angular/core';
import {EntityCommonModule} from '../common/entity-common.module';
import {EntityMaterialModule} from '../common/entity-material.module';
import {DialogModule} from '../dialog/dialog.module';
import {EntitySelectorListComponent} from './entity-selector-list.component';
import {EntitySelectorComponent} from './entity-selector.component';


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
