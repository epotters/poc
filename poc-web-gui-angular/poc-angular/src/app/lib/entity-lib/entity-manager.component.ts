import {ComponentFactoryResolver, Directive, OnDestroy, OnInit, Type} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs';
import {take} from 'rxjs/operators';
import {EntityComponentDescriptor} from './common/component-loader/component-loader';
import {EntityLibConfig} from './common/entity-lib-config';
import {EntityComponentDialogComponent} from './dialog/entity-component-dialog.component';

import {EntityMeta} from './domain/entity-meta.model';
import {Identifiable} from './domain/identifiable.model';
import {EntityDataSource} from './entity-data-source';
import {EntityService} from './entity.service';


@Directive()
export abstract class EntityManagerComponent<T extends Identifiable> implements OnInit, OnDestroy {

  dataSource: EntityDataSource<T>;
  selectedEntity: BehaviorSubject<T | null> = new BehaviorSubject<T | null>(null);

  pageSize = 10;
  private terminator: Subject<any> = new Subject();


  title: string = `${this.meta.displayName} manager`;
  columns: string[] = [];
  columnSetName: string = 'displayedColumnsDialog';


  listComponent: Type<any>;
  cardsComponent: Type<any>;
  detailComponent: Type<any>;
  editorComponent: Type<any>;


  listVisible: boolean = false;
  cardsVisible: boolean = false;
  detailVisible: boolean = false;
  editorVisible: boolean = false;


  protected constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public componentFactoryResolver: ComponentFactoryResolver
  ) {
    console.debug(`Constructing the EntityManagerComponent for type ${this.meta.displayName}`);
    this.columns = meta[this.columnSetName] || meta.displayedColumns;
  }

  ngOnInit() {
    this.dataSource = new EntityDataSource<T>(this.meta, this.service);
    this.dataSource.connect();

    this.listView();
  }

  ngOnDestroy(): void {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
    this.terminator.next();
    this.terminator.complete();
  }

  toggleList() {
    this.listVisible = !this.listVisible;
  }

  toggleCards() {
    this.cardsVisible = !this.cardsVisible;
  }

  toggleDetail() {
    this.detailVisible = !this.detailVisible;
  }

  toggleEditor() {
    this.editorVisible = !this.editorVisible;
  }

  listView() {
    this.listVisible = true;
    this.cardsVisible = false;
    this.detailVisible = true;
    this.editorVisible = false;
  }

  cardView() {
    this.listVisible = false;
    this.cardsVisible = true;
    this.detailVisible = false;
    this.editorVisible = false;
  }

  editorView() {
    this.listVisible = false;
    this.cardsVisible = false;
    this.detailVisible = false;
    this.editorVisible = true;
  }

  combiView() {
    if (!this.listVisible && !this.cardsVisible) {
      this.listVisible = true;
    }
    this.detailVisible = false;
    this.editorVisible = true;
  }


  abstract openDialogWithList();

  abstract openDialogWithEditor(entity?: T);

  openDialogWithEntityComponent(componentToShow: EntityComponentDescriptor): void {
    const dialogRef = this.dialog.open(EntityComponentDialogComponent, {
      width: EntityLibConfig.defaultDialogWidth,
      data: {
        componentFactoryResolver: this.componentFactoryResolver,
        componentDescriptor: componentToShow,
        entity: this.selectedEntity.getValue()
      }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(entity => {
      console.debug('The dialog was closed');
      if (entity) {
        this.selectedEntity.next(entity);
      }
    });
  }
}
