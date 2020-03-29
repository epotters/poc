import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ComponentFactoryResolver, Directive, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';

import {EntityMeta} from './domain/entity-meta.model';
import {Identifiable} from './domain/identifiable.model';
import {EntityService} from './entity.service';
import {DataSourceState} from './entity-list.component';
import {EntityLibConfig} from './common/entity-lib-config';
import {EntityComponentDescriptor} from './common/component-loader/entity-component-entrypoint.directive';
import {EntityComponentDialogComponent} from './dialog/entity-component-dialog.component';


@Directive()
export abstract class EntityManagerComponent<T extends Identifiable> implements OnDestroy {

  @Input() dataSourceState: DataSourceState;
  @Output() dataSourceStateEmitter: EventEmitter<DataSourceState> = new EventEmitter<DataSourceState>();

  title: string = this.meta.displayName + ' manager';
  dialogEntity: T;

  columns: string[] = [];
  columnSetName: string = 'displayedColumnsDialog';

  private terminator: Subject<any> = new Subject();

  selectedEntity?: T;

  listVisible: boolean = true;
  editorVisible: boolean = true;


  protected constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>,
    public route: ActivatedRoute,
    public componentFactoryResolver: ComponentFactoryResolver,
    public dialog: MatDialog
  ) {
    console.debug(`Constructing the EntityManagerComponent for type ${this.meta.displayName}`);
    this.columns = meta[this.columnSetName] || meta.displayedColumns;
  }

  ngOnDestroy(): void {
    this.terminator.next();
    this.terminator.complete();
  }

  onEntitySelected(entity: T) {
    console.debug('EntitySelected event received', entity);
    this.selectedEntity = entity;
    this.openDialogWithEditor(entity);
  }

  toggleList() {
    this.listVisible = !this.listVisible;
  }

  toggleEditor() {
    this.editorVisible = !this.editorVisible;
  }

  abstract openDialogWithList();

  abstract openDialogWithEditor(entity?: T);

  openDialogWithEntityComponent(componentToShow: EntityComponentDescriptor): void {
    const dialogRef = this.dialog.open(EntityComponentDialogComponent, {
      width: EntityLibConfig.defaultDialogWidth,
      data: {
        componentFactoryResolver: this.componentFactoryResolver,
        componentDescriptor: componentToShow,
        entity: this.dialogEntity
      }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.terminator)).subscribe(entity => {
      console.debug('The dialog was closed');
      if (entity) {
        this.dialogEntity = entity;
      }
    });
  }

  onAnimationEvent(event: AnimationEvent) {
    console.debug('EntityManagerComponent - AnimationEvent', event);
  }
}
