import {NgModule} from '@angular/core';
import {ConfirmationDialogComponent} from "./confirmation-dialog.component";
import {EntityCommonModule} from "./entity-common.module";


@NgModule({
  imports: [
    EntityCommonModule
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


