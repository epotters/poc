import {Directive, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {EntityLibConfig} from './common/entity-lib-config';

import {ConfirmationDialogComponent} from './dialog/confirmation-dialog.component';
import {EntityMeta, ValidatorDescriptor} from './domain/entity-meta.model';
import {Identifiable} from './domain/identifiable.model';
import {EntityService} from './entity.service';


@Directive()
export abstract class EntityEditorComponent<T extends Identifiable> implements OnInit, OnDestroy {

  // entitySubject is used by both the relations submodules and the manager
  @Input() entitySubject: BehaviorSubject<T | null> = new BehaviorSubject<T | null>(null);
  @Input() isManaged: boolean = false;
  @Input() editorColumns: string[] = this.meta.displayedColumns;


  title: string;
  entityForm: FormGroup;

  enableValidation: boolean = true;

  terminator: Subject<any> = new Subject();


  protected constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>,
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {
    console.debug(`Constructing the EntityEditorComponent for type ${this.meta.displayName}`);
    this.entityForm = this.buildForm(formBuilder);
  }


  ngOnInit() {

    console.debug(`Initializing the EntityEditorComponent for type ${this.meta.displayName}`);

    this.entitySubject.pipe(takeUntil(this.terminator)).subscribe((entity: T | null) => {
      console.debug('Entity changed', entity);

      if (!!entity) {
        this.title = `${this.meta.displayName} Editor`;
        this.entityForm.patchValue(entity);
      } else {
        console.info('Editor for a new entity');
        this.title = `New ${this.meta.displayName}`;
        this.clearEditor();
        this.prefillFromQueryString();
      }
    });

    // Load id from path
    const entityIdToLoad = this.getIdFromPath();
    if (entityIdToLoad) {
      this.loadEntity(entityIdToLoad);
    }

  }


  ngOnDestroy(): void {
    this.terminator.next();
    this.terminator.complete();
  }

  prefillFromQueryString() {
    this.route.queryParams.pipe(takeUntil(this.terminator)).subscribe(params => {
      for (const key in params) {
        if (params.hasOwnProperty(key) && this.entityForm.controls.hasOwnProperty(key)) {
          const formControl: AbstractControl | null = this.entityForm.get(key);
          if (!!formControl && params.hasOwnProperty(key)) {
            console.debug(`Set field ${key} to value ${params[key]}`);
            formControl.setValue(params[key]);
            formControl.markAsDirty();
          }
        }
      }
    });
  }


  loadEntity(entityId) {
    this.service.get(entityId).pipe(
      tap(entity => {
        this.entityForm.patchValue(entity);
        this.entitySubject.next(entity);
      })
    ).pipe(takeUntil(this.terminator)).subscribe();
  }


  saveEntity() {
    if (this.entityForm.valid) {
      const entity: T = this.entityForm.getRawValue();

      console.debug(`Ready to save ${this.meta.displayName} :` + JSON.stringify(entity));
      this.service.save(entity).pipe(takeUntil(this.terminator)).subscribe((savedEntity) => {
        let msg: string;
        if (entity.id) {
          msg = `${this.meta.displayName} named "${this.meta.displayNameRenderer(entity)}" is updated successfully`;
        } else {
          msg = `${this.meta.displayName} named "${this.meta.displayNameRenderer(savedEntity)}" is created successfully with id ${savedEntity.id}`;
          if (!this.isManaged) {
            this.router.navigate([this.meta.apiBase + '/' + savedEntity.id]);
          }
        }
        console.info(msg);

        this.snackbar.open(msg, undefined, {
          duration: EntityLibConfig.defaultSnackbarDuration
        });

        this.entityForm.patchValue(savedEntity, {emitEvent: false});
        this.entitySubject.next(savedEntity);
        this.entityForm.markAsPristine();
        this.entityForm.markAsUntouched();

      });
    } else {
      console.info('Not a valid entity', this.entityForm.errors);
    }
  }


  deleteEntity() {
    if (this.isNew()) {
      console.info('This entity is not yet created and therfore cannot be deleted');
      return;
    }

    const entity = this.entityForm.getRawValue();
    const dialogRef = this.openConfirmationDialog('Confirm delete',
      `Are you sure you want to delete ${this.meta.displayName.toLowerCase()} named ${this.meta.displayNameRenderer(entity)}?`);

    dialogRef.afterClosed().pipe(takeUntil(this.terminator)).subscribe(
      data => {
        console.debug('Dialog output:', data);
        if (data.confirmed) {
          console.info('User confirmed delete action, so it will be executed');
          this.service.delete(entity.id).pipe(takeUntil(this.terminator)).subscribe((response) => {
            console.info('response ', response);
            const msg = `${this.meta.displayName} named  ${this.meta.displayNameRenderer(entity)} is deleted successfully`;
            console.info(msg);
            this.snackbar.open(msg, undefined, {
              duration: EntityLibConfig.defaultSnackbarDuration
            });
            this.goToList();
          });
        } else {
          console.info('User canceled delete action');
        }
      }
    );
  }


  revert() {
    const entityId = this.entityForm.getRawValue().id;
    if (entityId) {
      this.loadEntity(entityId);
    } else {
      this.entitySubject.next(null);
    }
  }


  clearEditor() {
    this.entityForm.reset();
  }

  isNew(): boolean {
    const entity = this.entityForm.getRawValue();
    return (!entity || !entity.id);
  }


  hasErrorOfType(fieldName: string, validationType: string): boolean {
    const formControl: AbstractControl | null = this.entityForm.get(fieldName);
    return (!!formControl && formControl.hasError(validationType) && (formControl.dirty || formControl.touched));
  }


  buildForm(formBuilder: FormBuilder): FormGroup {
    const group = {};
    for (const key in this.editorColumns) {
      if (this.editorColumns.hasOwnProperty(key)) {
        group[key] = new FormControl('', this.buildValidators(key));
      }
    }
    return this.formBuilder.group(group);
  }


  buildValidators(fieldName: string): any[] {
    if (!this.enableValidation) {
      return [];
    }

    if (fieldName.indexOf('.') > -1) {
      fieldName = fieldName.split('.')[0];
    }

    const validators: any[] = [];
    const validatorDescriptors = this.meta.columnConfigs[fieldName].validators;
    if (validatorDescriptors) {
      for (const key in validatorDescriptors) {
        if (validatorDescriptors.hasOwnProperty(key)) {
          const validatorDescriptor: ValidatorDescriptor = validatorDescriptors[key];
          const validator = (validatorDescriptor.argument) ?
            Validators[validatorDescriptor.type](validatorDescriptor.argument) :
            Validators[validatorDescriptor.type];
          validators.push(validator);
        }
      }
    }
    return validators;
  }


  openConfirmationDialog(title: string, message: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: title,
      message: message
    };
    return this.dialog.open(ConfirmationDialogComponent, dialogConfig);
  }


  getIdFromPath(): number | null {
    const idTxt: string | null = this.route.snapshot.paramMap.get('id');
    return (!!idTxt) ? parseInt(idTxt) : null;
  }

  goToList() {
    this.router.navigate([this.meta.apiBase]).then(() => {
      console.info('Navigated from the editor to list view');
    });
  }
}
