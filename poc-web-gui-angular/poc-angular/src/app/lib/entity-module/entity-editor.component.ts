import {Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {tap} from "rxjs/operators";

import {ConfirmationDialogComponent} from "./dialog/confirmation-dialog.component";
import {EntityService} from "./entity.service";
import {EntityMeta, ValidatorDescriptor} from "./domain/entity-meta.model";
import {BehaviorSubject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Identifiable} from "./domain/identifiable.model";


@Directive()
export abstract class EntityEditorComponent<T extends Identifiable> implements OnInit, OnChanges, OnDestroy {

  @Input() entityToLoad?: T;
  @Input() isManaged: boolean = false;
  @Input() editorColumns: string[] = this.meta.displayedColumns;

  title: string;
  entityForm: FormGroup;
  entitySubject: BehaviorSubject<T> = new BehaviorSubject<T>({} as T); // Used by the relations submodules

  enableValidation: boolean = true;

  protected constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>,
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {
    console.debug('Constructing the EntityEditorComponent for type ' + this.meta.displayName);
    this.entityForm = this.buildForm(formBuilder);
  }


  ngOnInit() {
    console.debug('Initializing the EntityEditorComponent');

    const entityIdToLoad = this.getIdFromPath();
    if (entityIdToLoad) {
      this.loadEntity(entityIdToLoad);
      this.title = this.meta.displayName + ' Editor';
    } else if (this.entityToLoad != null) {
      console.debug('Editor - entityToLoad has been set externally');
      this.loadNewEntity(this.entityToLoad);
      this.title = this.meta.displayName + ' Editor';
    } else {
      console.info('Editor for a new entity');
      this.title = 'New ' + this.meta.displayName;
      this.prefillFromQueryString();
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    console.debug('Editor ngOnChanges', changes);
    if (changes.entityToLoad.currentValue && !changes.entityToLoad.previousValue
      ||
      changes.entityToLoad.currentValue &&
      changes.entityToLoad.currentValue.id !== changes.entityToLoad.previousValue.id) {

      console.debug('EntityToLoad has changed. Loading...');
      this.loadNewEntity(changes.entityToLoad.currentValue);
    }
  }

  ngOnDestroy(): void {
    console.log('Destroying EntityEditorComponent');
    this.entitySubject.complete();
  }

  prefillFromQueryString() {
    this.route.queryParams.subscribe(params => {
      for (let key in params) {
        if (params.hasOwnProperty(key) && this.entityForm.hasOwnProperty(key)) {
          let formControl: AbstractControl | null = this.entityForm.get(key);
          if (!!formControl && params.hasOwnProperty(key)) {
            formControl.setValue(params[key]);
          }
        }
      }
    });
  }


  loadNewEntity(entity: T | null) {
    if (entity !== null) {
      this.loadEntity(entity.id);
    } else {
      this.entityToLoad = undefined;
      this.clearEditor();
    }
  }


  loadEntity(entityId) {
    this.service.get(entityId).pipe(
      tap(entity => {
        console.debug('About to patch the entity loaded');
        this.entityForm.patchValue(entity);
        console.info(this.meta.displayName + ' loaded in the editor');
        this.entitySubject.next(entity);
      })
    ).subscribe();
  }


  saveEntity() {
    if (this.entityForm.valid) {
      let entity: T = this.entityForm.getRawValue();

      console.debug('Ready to save ' + this.meta.displayName + ': ' + JSON.stringify(entity));
      this.service.save(entity).subscribe((savedEntity) => {
        let msg: string;
        if (entity.id) {
          msg = this.meta.displayName + ' named "' + this.meta.displayNameRenderer(entity) + '" is updated successfully';
        } else {
          msg = this.meta.displayName + ' named "' + this.meta.displayNameRenderer(savedEntity) + '" is created successfully with id ' + savedEntity.id;
          this.router.navigate([this.meta.apiBase + '/' + savedEntity.id]);
        }
        console.info(msg);

        this.snackbar.open(msg, undefined, {
          duration: 3000
        });

        console.log('savedEntity:', savedEntity);

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

    let entity = this.entityForm.getRawValue();
    const dialogRef = this.openConfirmationDialog('Confirm delete',
      'Are you sure you want to delete ' + this.meta.displayName.toLowerCase() + ' named ' + this.meta.displayNameRenderer(entity) + '?');

    dialogRef.afterClosed().subscribe(
      data => {
        console.debug("Dialog output:", data);
        if (data.confirmed) {
          console.info('User confirmed delete action, so it will be executed');
          this.service.delete(entity.id).subscribe((response) => {
            console.info('response ', response);
            let msg = this.meta.displayName + ' named ' + this.meta.displayNameRenderer(entity) + ' is deleted successfully';
            console.info(msg);
            this.snackbar.open(msg, undefined, {
              duration: 2000
            });
            // Redirect to the list view
            this.goToList();
          });
        } else {
          console.info('User canceled delete action');
        }
      }
    );
  }


  revert() {
    let entityId = this.entityForm.getRawValue().id;
    if (entityId) {
      this.loadEntity(entityId);
    } else {
      // TODO: Clear the form
    }
  }


  clearEditor() {
    this.entityForm.reset();
  }

  isNew(): boolean {
    let entity = this.entityForm.getRawValue();
    return (!entity || !entity.id);
  }


  hasErrorOfType(fieldName: string, validationType: string): boolean {
    const formControl: AbstractControl | null = this.entityForm.get(fieldName);
    return (!!formControl && formControl.hasError(validationType) && (formControl.dirty || formControl.touched));
  }


  buildForm(formBuilder: FormBuilder): FormGroup {
    let group = {};
    for (let key in this.editorColumns) {
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
      for (let key in validatorDescriptors) {
        if (validatorDescriptors.hasOwnProperty(key)) {
          let validatorDescriptor: ValidatorDescriptor = validatorDescriptors[key];
          let validator = (validatorDescriptor.argument) ?
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
