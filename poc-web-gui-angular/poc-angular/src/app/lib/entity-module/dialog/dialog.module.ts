import {NgModule} from '@angular/core';
import {ConfirmationDialogComponent} from "./confirmation-dialog.component";
import {EntityCommonModule} from "../common/entity-common.module";
import {EntityMaterialModule} from "../common/entity-material.module";
import {EntityComponentDialogComponent} from "./entity-component-dialog.component";
import {EntityComponentEntryPointDirective} from "./entity-component-entrypoint.directive";


@NgModule({
  imports: [
    EntityCommonModule,
    EntityMaterialModule
  ],
  declarations: [
    ConfirmationDialogComponent,
    EntityComponentDialogComponent,
    EntityComponentEntryPointDirective
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    EntityComponentDialogComponent
  ],
  providers: []
})
export class DialogModule {
}


