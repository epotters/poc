import {Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {tap} from "rxjs/operators";

import {ConfirmationDialogComponent} from "./dialog/confirmation-dialog.component";
import {EntityService} from "./entity.service";
import {EntityMeta} from "./domain/entity-meta.model";


export abstract class EntityComponent<T extends Identifiable> implements OnInit, OnChanges {

  @Input() entityToLoad: T;

  entityForm: FormGroup;

  isVisible: boolean = true;

  constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>,
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    console.debug('Constructing the EntityComponent for type ' + this.meta.displayName);

    this.buildForm(formBuilder);

    console.debug('Entity editor is ready');
  }

  ngOnInit() {
    console.debug('Initializing the EntityComponent');

    let entityId = this.route.snapshot.paramMap.get('id');

    if (entityId) {
      this.loadEntity(entityId);
    } else {
      console.info('Editor for a new entity');
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.entityToLoad.currentValue &&
      changes.entityToLoad.currentValue.id !== changes.entityToLoad.previousValue) {

      console.debug('EntityToLoad has changed:');
      console.debug(changes.entityToLoad.previousValue);
      console.debug(changes.entityToLoad.currentValue);

      this.loadNewEntity(changes.entityToLoad.currentValue);

      // You can also use categoryId.previousValue and
      // categoryId.firstChange for comparing old and new values
    }

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
      console.debug('TODO: Clear the form');
  }


  loadEntity(entityId) {
    this.service.get(entityId).pipe(
      tap(entity => {
        console.log('About to patch the entity loaded');
        console.debug(entity);
        this.entityForm.patchValue(entity);
        console.log(this.meta.displayName + ' loaded');
      })
    ).subscribe();
  }


  saveEntity() {
    if (this.entityForm.valid) {
      let entity: T = this.entityForm.getRawValue();

      console.debug('Ready to save ' + this.meta.displayName + ': ' + JSON.stringify(entity));
      this.service.save(entity).subscribe((response) => {
        let msg = this.meta.displayName + ' with id ' + entity.id + ' is saved successfully';
        console.info(msg);
        console.log('repsonse ', response);
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

            // Redirect to the list view
            this.router.navigate([this.meta.namePlural]);

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

  onValueChanged(fieldName: string, newValue: string) {
    console.debug('Field ' + fieldName + ' changed to ' + newValue);
    this.entityForm.patchValue({[fieldName]: newValue});
  }

  buildForm(formBuilder: FormBuilder) {
    this.entityForm = formBuilder.group({
      id: new FormControl()
      // firstName: new FormControl('', [
      //   Validators.required,
      //   Validators.pattern(this.namePattern)
      // ])
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


  public show(): void {
    this.isVisible = true;
  }

  public hide(): void {
    this.isVisible = false;
  }

}
