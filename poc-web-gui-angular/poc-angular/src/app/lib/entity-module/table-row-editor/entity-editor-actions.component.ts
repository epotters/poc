import {Component, EventEmitter, Inject, Output} from "@angular/core";
import {EntityMeta} from "../domain/entity-meta.model";
import {EntityService} from "../entity.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../dialog/confirmation-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormGroup} from "@angular/forms";
import {META, SERVICE} from "../entity-tokens";

export interface ActionResult<T> {
  action: 'save' | 'delete';
  result: 'ok' | 'error'
  entity?: T
}


@Component({
  selector: 'editor-actions',
  template: ''
})
export class EntityEditorActionsComponent<T extends Identifiable> {

  @Output() actionResult: EventEmitter<ActionResult<T>> = new EventEmitter<ActionResult<T>>();

  snackbarDuration: number = 3000;


  constructor(
    @Inject(META) public meta: EntityMeta<T>,
    @Inject(SERVICE) public service: EntityService<T>,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {
  }


  saveEntity(entityForm: FormGroup) {
    if (entityForm.valid) {
      let entity: T = entityForm.getRawValue();

      console.debug('Ready to save ' + this.meta.displayName + ': ' + JSON.stringify(entity));
      this.service.save(entity).subscribe((savedEntity) => {
        let msg: string;
        if (entity.id) {
          msg = this.meta.displayName + ' with id ' + entity.id + ' is updated successfully';
        } else {
          msg = this.meta.displayName + ' is created successfully with id ' + savedEntity.id;
          this.actionResult.emit({action: 'save', result: 'ok', entity: savedEntity});
        }
        console.info(msg);

        this.snackbar.open(msg, null, {
          duration: this.snackbarDuration
        });

        console.log('savedEntity: ', savedEntity);

        entityForm.patchValue(savedEntity);
        entityForm.markAsPristine();
        entityForm.markAsUntouched();

      });
    } else {
      console.info('Not a valid entity');
    }
  }


  deleteEntity(entity: T) {


    if ((!entity || !entity.id)) {
      let msg: string = 'This entity is either not available or not yet created and therfore cannot be deleted';
      console.info(msg);
      this.snackbar.open(msg, null, {
        duration: this.snackbarDuration
      });
      return;
    }


    const dialogRef = this.openConfirmationDialog('Confirm delete',
      'Are you sure you want to delete this ' + this.meta.displayName + '?');

    dialogRef.afterClosed().subscribe(
      data => {
        console.debug("Dialog output:", data);
        if (data.confirmed) {
          console.info('User confirmed delete action, so it will be executed');
          this.service.destroy(('' + entity.id)).subscribe((response) => {
            console.info('response ', response);
            let msg = this.meta.displayName + ' with id ' + entity.id + ' is deleted successfully';
            console.info(msg);
            this.snackbar.open(msg, null, {
              duration: this.snackbarDuration
            });

            // Redirect to the list view
            // this.goToList();

            this.actionResult.emit({action: 'delete', result: 'ok'});
          });
        } else {
          console.info('User canceled delete action');
        }
      }
    );
  }


  updateEntities() {
    const dialogRef = this.openConfirmationDialog('Confirm batch update',
      'Are you sure you want to update all selected ' + this.meta.displayNamePlural.toLowerCase() + '?');

    dialogRef.afterClosed().subscribe(
      data => {
        if (data.confirmed) {
          console.info('User confirmed batch update action, so ik will be executed');
          this.actionResult.emit({action: 'save', result: 'ok'});
        } else {
          console.info('User canceled update action');
        }
      }
    );
  }


  deleteEntities() {
    const dialogRef = this.openConfirmationDialog('Confirm deletion',
      'Are you sure you want to delete all selected ' + this.meta.displayNamePlural.toLowerCase() + '?');
    dialogRef.afterClosed().subscribe(
      data => {
        if (data.confirmed) {
          console.info('User confirmed batch delete action, so it will be executed');
          this.actionResult.emit({action: 'save', result: 'ok'});
        } else {
          console.info('User canceled batch delete action');
        }
      }
    );
  }

  openConfirmationDialog(title: string, message: string): any {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: title,
      message: message
    };
    return this.dialog.open(ConfirmationDialogComponent, dialogConfig);
  }

}
