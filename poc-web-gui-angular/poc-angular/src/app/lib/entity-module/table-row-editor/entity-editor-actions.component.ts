import {Component, Input, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {EntityMeta, Identifiable} from '.';
import {EntityLibConfig} from '../common/entity-lib-config';
import {ConfirmationDialogComponent} from '../dialog/confirmation-dialog.component';
import {EntityService} from '../entity.service';


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
export class EntityEditorActionsComponent<T extends Identifiable> implements OnDestroy {

  @Input() meta: EntityMeta<T>;
  @Input() service: EntityService<T>;

  private terminator: Subject<any> = new Subject();

  constructor(
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {
  }


  ngOnDestroy(): void {
    this.terminator.next();
    this.terminator.complete();
  }


  saveEntity(entityForm: FormGroup, overlay?: any): Observable<ActionResult<T>> {

    const savedEntitySubject: BehaviorSubject<ActionResult<T>> = new BehaviorSubject<ActionResult<T>>(
      {success: false, changes: false, msg: 'BehaviorSubject for entity saving created'}
    );

    if (entityForm.valid) {

      const entity: T = entityForm.getRawValue();

      for (const idx in Reflect.ownKeys(overlay)) {
        const key = Reflect.ownKeys(overlay)[idx] as string;
        // @ts-ignore
        entity[key] = overlay[key];
        console.debug('Apply overlay before saving', key, overlay[key]);
      }

      console.debug('Ready to save', this.meta.displayName, ':', entity);
      this.service.save(entity)
        .pipe(takeUntil(this.terminator)).subscribe((savedEntity) => {
        let msg: string;
        if (entity.id) {
          msg = `${this.meta.displayName}  named ${this.meta.displayNameRenderer(entity)} is updated successfully`;
        } else {
          msg = `${this.meta.displayName}  named ${this.meta.displayNameRenderer(entity)} is  created successfully with id ${savedEntity.id}`;
        }

        console.info(msg);
        this.snackbar.open(msg, undefined, {
          duration: EntityLibConfig.defaultSnackbarDuration
        });

        console.debug('Before marking the form as pristine, is it dirty?', entityForm.dirty);
        entityForm.markAsPristine();
        entityForm.markAsUntouched();

        console.debug('After marking the form as pristine, is it still dirty?', entityForm.dirty);
        savedEntitySubject.next({success: true, changes: true, msg: msg, entity: savedEntity});
      });
    } else {
      const msg = 'Not a valid ' + this.meta.displayName.toLowerCase() + '. Please correct the errors before saving';
      console.info(msg);
      console.debug('Validation errors', entityForm.errors);
      EntityEditorActionsComponent.listInvalidFields(entityForm);
      savedEntitySubject.next({success: false, changes: false, msg: msg});
    }
    return savedEntitySubject.asObservable();
  }


  deleteEntity(entity: T): Observable<ActionResult<T>> {

    const deleteEntitySubject: BehaviorSubject<ActionResult<T>> = new BehaviorSubject<ActionResult<T>>(
      {success: false, changes: false, msg: 'BehaviorSubject for entity deleting created'}
    );

    if ((!entity || !entity.id)) {
      const msg: string = 'This entity is either not available or not yet created and therefore cannot be deleted';
      console.info(msg);

      this.snackbar.open(msg, undefined, {
        duration: EntityLibConfig.defaultSnackbarDuration
      });
      deleteEntitySubject.next({success: false, changes: false, msg: msg});
    }

    const dialogRef = this.openConfirmationDialog('Confirm delete ' + this.meta.displayName.toLowerCase(),
      `Are you sure you want to delete ${this.meta.displayNameRenderer(entity)}?`);

    dialogRef.afterClosed().subscribe(
      data => {
        console.debug('Dialog output:', data);
        if (data.confirmed) {

          console.info('User confirmed delete action, so it will be executed');

          return this.service.delete(('' + entity.id))
            .pipe(takeUntil(this.terminator)).subscribe(response => {
              const msg = this.meta.displayName + ' named ' + this.meta.displayNameRenderer(entity) + ' was deleted successfully';
              console.info(msg);
              this.snackbar.open(msg, undefined, {
                duration: EntityLibConfig.defaultSnackbarDuration
              });
              deleteEntitySubject.next({success: true, changes: true, msg: msg});
            });

        } else {
          const msg = 'User canceled delete action';
          console.info(msg);
          deleteEntitySubject.next({success: false, changes: false, msg: msg});
        }
      }
    );

    return deleteEntitySubject.asObservable();
  }


  public handleUnsavedChanges(entityForm: FormGroup, overlay?: any): Observable<ActionResult<T>> {
    const unsavedChangesSubject: BehaviorSubject<ActionResult<T>> = new BehaviorSubject<ActionResult<T>>(
      {success: false, changes: false, msg: 'BehaviorSubject for unsaved changes created'}
    );
    if (entityForm.dirty) {
      const msg = 'The editor row has unsaved changes';
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
              const msg = 'User chose to discard changes in the editor';
              console.info(msg);
              unsavedChangesSubject.next({success: true, changes: false, msg: msg});
            }
          }
        );
      }

    } else {
      const msg = 'The editor row doesn\'t have unsaved changes';
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
      .pipe(takeUntil(this.terminator)).subscribe((result: ActionResult<T>) => {
      const msg = 'Entity saved, no more unsaved changes';
      console.debug(msg);
      unsavedChangesSubject.next(result);
    });
  }


  private static listInvalidFields(entityForm: FormGroup) {
    const controls = entityForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.debug(`Field ${name} is invalid`, controls[name].value, controls[name].errors);
      }
    }
  }


}
