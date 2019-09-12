import {NgModule} from '@angular/core';
import {ConfirmationDialogComponent} from "./confirmation-dialog.component";
import {EntityCommonModule} from "../common/entity-common.module";
import {EntityMaterialModule} from "../common/entity-material.module";


@NgModule({
  imports: [
    EntityCommonModule,
    EntityMaterialModule
  ],
  declarations: [
    ConfirmationDialogComponent
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ],
  providers: []
})
export class DialogModule {
}


