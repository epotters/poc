import {ComponentFactoryResolver, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";

import {EntityService} from "./entity.service";
import {EntityMeta} from "./domain/entity-meta.model";
import {ActivatedRoute} from "@angular/router";
import {EntityComponentDescriptor, EntityComponentDialogComponent} from "./dialog/entity-component-dialog.component";


export abstract class EntityManagerComponent<T extends Identifiable> implements OnInit {

  title: string = this.meta.displayName + ' manager';
  dialogEntity: T;

  columns: string[] = [];
  columnSetName: string = 'displayedColumnsDialog';

  selectedEntity?: T;

  listVisible: boolean = true;
  editorVisible: boolean = true;

  defaultDialogWidth: string = '600px';

  constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>,
    public route: ActivatedRoute,
    public componentFactoryResolver: ComponentFactoryResolver,
    public dialog: MatDialog
  ) {
    console.debug('Constructing the EntityManagerComponent for type ' + this.meta.displayName);
    this.columns = meta[this.columnSetName] || meta.displayedColumns;
    console.debug('Columns:', this.columns);
  }

  ngOnInit() {
    console.debug('Initializing the EntityManagerComponent for type ' + this.meta.displayName);
  }

  entityFromRoute() {
    let entityId = this.route.snapshot.paramMap.get('id');

    if (entityId) {
      // this.loadEntity(entityId);
    } else {
      console.info('Editor for a new entity');
    }
  }

  onEntitySelected($event) {
    console.debug('EntitySelected event received', $event);
    this.selectedEntity = $event;
  }

  toggleList() {
    this.listVisible = !this.listVisible;
  }

  toggleEditor() {
    this.editorVisible = !this.editorVisible;
  }


  abstract openDialogWithList();

  abstract openDialogWithEditor();


  openDialogWithEntityComponent(componentToShow: EntityComponentDescriptor): void {
    const dialogRef = this.dialog.open(EntityComponentDialogComponent, {
      width: this.defaultDialogWidth,
      data: {
        componentFactoryResolver: this.componentFactoryResolver,
        componentDescriptor: componentToShow,
        entity: this.dialogEntity
      }
    });

    dialogRef.afterClosed().subscribe(entity => {
      console.log('The dialog was closed');
      if (entity) {
        this.dialogEntity = entity;
      }
    });
  }


}
