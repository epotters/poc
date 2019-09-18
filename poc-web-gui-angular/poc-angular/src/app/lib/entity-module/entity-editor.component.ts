import {Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {tap} from "rxjs/operators";

import {ConfirmationDialogComponent} from "./dialog/confirmation-dialog.component";
import {EntityService} from "./entity.service";
import {EntityMeta} from "./domain/entity-meta.model";
import {BehaviorSubject} from "rxjs";
import {MatSnackBar} from "@angular/material";


export abstract class EntityEditorComponent<T extends Identifiable> implements OnInit, OnChanges {

  @Input() entityToLoad?: T;
  @Input() isManaged: boolean = false;

  title: string;
  entityForm: FormGroup;

  isVisible: boolean = true;

  entitySubject = new BehaviorSubject<T>(this.entityToLoad);

  constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>,
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {
    console.debug('Constructing the EntityEditorComponent for type ' + this.meta.displayName);
    this.buildForm(formBuilder);
  }


  ngOnInit() {
    console.debug('Initializing the EntityEditorComponent');

    const entityIdToLoad = this.getIdFromPath();
    if (entityIdToLoad) {
      this.title = this.meta.displayName + ' Editor';
      this.loadEntity(entityIdToLoad);
    } else {
      console.info('Editor for a new entity');
      this.title = 'New ' + this.meta.displayName;
      this.prefillFromQueryString();
    }
  }


  prefillFromQueryString() {
    this.route.queryParams.subscribe(params => {
      for (let key in params) {
        if (this.entityForm.get(key)) {
          this.entityForm.get(key).setValue(params[key]);
        }
      }
    });
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.entityToLoad.currentValue &&
      changes.entityToLoad.currentValue.id !== changes.entityToLoad.previousValue) {
      console.debug('EntityToLoad has changed. Loading...');
      this.loadNewEntity(changes.entityToLoad.currentValue);
    }
  }

  getIdFromPath(): number | null {
    return parseInt(this.route.snapshot.paramMap.get('id'));
  }

  loadNewEntity(entity: T) {
    if (entity !== null) {
      this.loadEntity(entity.id);
    } else {
      this.entityToLoad = null;
      this.clearEditor();
    }
  }

  clearEditor() {
    this.entityForm.reset();
  }

  loadEntity(entityId) {
    this.service.get(entityId).pipe(
      tap(entity => {
        console.log('About to patch the entity loaded');
        console.debug(entity);
        this.entityForm.patchValue(entity);
        this.entitySubject.next(entity);
        console.log(this.meta.displayName + ' loaded');
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
          msg = this.meta.displayName + ' with id ' + entity.id + ' is updated successfully';
        } else {
          msg = this.meta.displayName + ' is created successfully with id ' + savedEntity.id;
          this.router.navigate([this.meta.apiBase + '/' + savedEntity.id]);
        }
        console.info(msg);

        this.snackbar.open(msg, null, {
          duration: 3000
        });

        console.log('savedEntity: ', savedEntity);

        this.entityForm.patchValue(savedEntity);
        this.entitySubject.next(savedEntity);
        this.entityForm.markAsPristine();
        this.entityForm.markAsUntouched();

      });
    } else {
      console.info('Not a valid entity');
    }
  }

  deleteEntity() {
    if (this.isNew()) {
      return;
    }

    let entity = this.entityForm.getRawValue();

    const dialogRef = this.openConfirmationDialog('Confirm delete',
      'Are you sure you want to delete this ' + this.meta.displayName + '?');

    dialogRef.afterClosed().subscribe(
      data => {
        console.debug("Dialog output:", data);
        if (data.confirmed) {
          console.info('User confirmed delete action, so it will be executed');
          this.service.destroy(entity.id).subscribe((response) => {
            console.info('response ', response);
            let msg = this.meta.displayName + ' with id ' + entity.id + ' is deleted successfully';
            console.info(msg);
            this.snackbar.open(msg, null, {
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

  isNew(): boolean {
    let entity = this.entityForm.getRawValue();
    return (!entity || !entity.id);
  }

  hasValidChanges(): boolean {
    return this.entityForm.dirty && this.entityForm.valid;
  }

  hasErrorOfType(fieldName: string, validationType: string): boolean {
    const formControl = this.entityForm.get(fieldName);
    return (formControl.hasError(validationType) && (formControl.dirty || formControl.touched));
  }

  onValueChanged(fieldName: string, newValue: string): void {
    console.debug('Field ' + fieldName + ' changed to ' + newValue);
    this.entityForm.patchValue({[fieldName]: newValue});
  }

  // TODO: Create a gemeric version based upon EntityMeta
  // Override this method
  buildForm(formBuilder: FormBuilder): void {
    this.entityForm = formBuilder.group({
      id: new FormControl()
    });
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


  goToList() {
    this.router.navigate([this.meta.apiBase]);
  }

  public show(): void {
    this.isVisible = true;
  }

  public hide(): void {
    this.isVisible = false;
  }

}
