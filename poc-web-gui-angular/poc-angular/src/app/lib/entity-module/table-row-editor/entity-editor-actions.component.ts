import {Component, Input} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BehaviorSubject, Observable} from "rxjs";
import {EntityMeta} from "..";
import {EntityService} from "../entity.service";
import {ConfirmationDialogComponent} from "../dialog/confirmation-dialog.component";
import {EntityLibConfig} from "../common/entity-lib-config";


export interface ActionResult<T> {
  success: boolean;
  changes: boolean;
  msg: string;
  entity?: T
}


@Component({
  selector: 'editor-actions',
  template: ''
})
export class EntityEditorActionsComponent<T extends Identifiable> {

  @Input() meta: EntityMeta<T>;
  @Input() service: EntityService<T>;


  constructor(
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {
  }


  saveEntity(entityForm: FormGroup, overlay?: any): Observable<ActionResult<T>> {

    let savedEntitySubject: BehaviorSubject<ActionResult<T>> = new BehaviorSubject<ActionResult<T>>(
      {success: false, changes: false, msg: 'BehaviorSubject for entity saving created'}
    );

    if (entityForm.valid) {

      let entity: T = entityForm.getRawValue();

      for (let idx in Reflect.ownKeys(overlay)) {
        let key = Reflect.ownKeys(overlay)[idx];
        entity[key] = overlay[key];
        console.debug('Apply overlay before saving', key, overlay[key]);
      }

      console.debug('Ready to save', this.meta.displayName, ':', entity);
      this.service.save(entity)
        .subscribe((savedEntity) => {
          let msg: string;
          if (entity.id) {
            msg = this.meta.displayName + ' with id ' + entity.id + ' is updated successfully';
          } else {
            msg = this.meta.displayName + ' is created successfully with id ' + savedEntity.id;
          }

          console.info(msg);
          this.snackbar.open(msg, null, {
            duration: EntityLibConfig.defaultSnackbarDuration
          });

          console.debug('Before marking the form as pristine, is it dirty?', entityForm.dirty);
          entityForm.markAsPristine();
          entityForm.markAsUntouched();

          console.debug('After marking the form as pristine, is it still dirty?', entityForm.dirty);

          savedEntitySubject.next({success: true, changes: true, msg: msg, entity: savedEntity});
        });
    } else {
      let msg = 'Not a valid ' + this.meta.displayName.toLowerCase() + '. Please correct the errors before saving';
      console.info(msg);
      console.debug('Validation errors', entityForm.errors);
      savedEntitySubject.next({success: false, changes: false, msg: msg});
    }
    return savedEntitySubject.asObservable();
  }


  deleteEntity(entity: T): Observable<ActionResult<T>> {

    let deleteEntitySubject: BehaviorSubject<ActionResult<T>> = new BehaviorSubject<ActionResult<T>>(
      {success: false, changes: false, msg: 'BehaviorSubject for entity deleting created'}
    );

    if ((!entity || !entity.id)) {
      let msg: string = 'This entity is either not available or not yet created and therefore cannot be deleted';
      console.info(msg);

      this.snackbar.open(msg, null, {
        duration: EntityLibConfig.defaultSnackbarDuration
      });
      deleteEntitySubject.next({success: false, changes: false, msg: msg});
    }

    const dialogRef = this.openConfirmationDialog('Confirm delete',
      'Are you sure you want to delete this ' + this.meta.displayName + '?');

    dialogRef.afterClosed().subscribe(
      data => {
        console.debug("Dialog output:", data);
        if (data.confirmed) {

          console.info('User confirmed delete action, so it will be executed');

          return this.service.delete(('' + entity.id))
            .subscribe(response => {

              let msg = this.meta.displayName + ' with id ' + entity.id + ' is deleted successfully';
              console.info(msg);
              this.snackbar.open(msg, null, {
                duration: EntityLibConfig.defaultSnackbarDuration
              });
              deleteEntitySubject.next({success: true, changes: true, msg: msg});
            });

        } else {
          let msg = 'User canceled delete action';
          console.info();
          deleteEntitySubject.next({success: false, changes: false, msg: msg});
        }
      }
    );

    return deleteEntitySubject.asObservable();
  }


  public handleUnsavedChanges(entityForm: FormGroup, overlay?: any): Observable<ActionResult<T>> {

    let unsavedChangesSubject: BehaviorSubject<ActionResult<T>> = new BehaviorSubject<ActionResult<T>>(
      {success: false, changes: false, msg: 'BehaviorSubject for unsaved changes created'}
    );

    if (entityForm.dirty) {

      let msg = 'The editor row has unsaved changes';
      console.debug(msg);

      if (EntityLibConfig.autoSave) {

        this.saveSilently(unsavedChangesSubject, entityForm, overlay);

      } else {

        const dialogRef = this.openConfirmationDialog('Unsaved changes', 'Do you want to save the changes?');

        dialogRef.afterClosed().subscribe(
          data => {
            if (data.confirmed) {
              console.info('User confirmed he wants to save changes to ' + this.meta.displayName.toLowerCase());
              this.saveSilently(unsavedChangesSubject, entityForm, overlay);
            } else {
              let msg = 'User chose to discard changes in the editor';
              console.info(msg);
              unsavedChangesSubject.next({success: true, changes: false, msg: msg});
            }
          }
        );
      }

    } else {
      let msg = 'The editor row doesn\'t have unsaved changes';
      console.debug(msg);
      unsavedChangesSubject.next({success: true, changes: false, msg: msg});
    }

    return unsavedChangesSubject.asObservable();
  }

  updateEntities() {
    const dialogRef = this.openConfirmationDialog('Confirm batch update',
      'Are you sure you want to update all selected ' + this.meta.displayNamePlural.toLowerCase() + '?');

    dialogRef.afterClosed().subscribe(
      data => {
        if (data.confirmed) {
          console.info('User confirmed batch update action, so it will be executed');
          // this.actionResult.emit({action: 'save', result: 'ok'});
        } else {
          console.info('User canceled batch update action');
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
          // this.actionResult.emit({action: 'save', result: 'ok'});
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

  private saveSilently(unsavedChangesSubject: BehaviorSubject<ActionResult<T>>, entityForm: FormGroup, overlay?: any) {

    this.saveEntity(entityForm, overlay)
      .subscribe((result: ActionResult<T>) => {
        let msg = 'Entity saved, no more unsaved changes';
        console.debug(msg);
        unsavedChangesSubject.next(result);
      });
  }

}
