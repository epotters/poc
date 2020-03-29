import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnDestroy,
  OnInit,
  Type,
  ViewChild
} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {
  EntityComponentDescriptor,
  EntityComponentEntryPointDirective
} from './common/component-loader/entity-component-entrypoint.directive';
import {ColumnConfig, EntityMeta, RelationEntity} from './domain/entity-meta.model';
import {Identifiable} from './domain/identifiable.model';
import {EditableListConfig, EntityListComponent} from './entity-list.component';


@Directive()
export abstract class EntityRelationComponent<T extends Identifiable, S extends Identifiable, R extends Identifiable>
  implements OnInit, OnDestroy {

  @Input() readonly ownerSubject: BehaviorSubject<S>;

  fieldName: string;
  visible: boolean = false;
  private terminator: Subject<any> = new Subject();

  component: Type<any>;
  componentRef: ComponentRef<EntityListComponent<T>>;
  @ViewChild(EntityComponentEntryPointDirective, {static: true}) componentEntrypoint: EntityComponentEntryPointDirective;


  protected constructor(
    public meta: EntityMeta<T>,
    public ownerMeta: EntityMeta<S>,
    public relatedMeta: EntityMeta<R>,
    public componentFactoryResolver: ComponentFactoryResolver
  ) {
    console.debug(`Constructing the EntityRelationComponent for relation ${this.meta.displayName}` +
      ` between ${this.ownerMeta.displayName} and ${this.relatedMeta.displayName}`);
  }

  ngOnInit(): void {
    this.activateRelation();
  }

  ngOnDestroy(): void {
    this.ownerSubject.complete();
    this.componentRef.destroy();
    this.terminator.next();
    this.terminator.complete();
  }


  private activateRelation(): void {
    this.ownerSubject.asObservable().pipe(takeUntil(this.terminator)).subscribe(owner => {
        if (!!owner && !!owner.id) {
          console.debug(`Owner loaded, about to build relation ${this.fieldName}`);
          this.visible = true;
          this.loadRelationList(owner);
        } else {
          this.visible = false;
          console.debug('No owner loaded yet');
        }
      }
    );
  }


  // Load the table
  private loadRelationList(owner: S) {

    const columnConfig: ColumnConfig = this.ownerMeta.columnConfigs[this.fieldName];
    const relationOverlay = {};

    if (!columnConfig.editor || !columnConfig.editor.relationEntity) {
      console.debug('Either the editor or the editor\'s relationEntity is not set. Stopping.');
      return;
    }

    const relationEntity: RelationEntity = columnConfig.editor.relationEntity;
    relationOverlay[relationEntity.owner] = owner;

    const listConfig: EditableListConfig<T> = {
      title: columnConfig.label,
      columns: relationEntity.columns,
      overlay: relationOverlay,
      initialSort: relationEntity.sort,
      initialSortDirection: relationEntity.sortDirection,
      headerVisible: false,
      paginatorVisible: false,
      filterVisible: false,
      editorVisible: false
    };

    const componentDescriptor: EntityComponentDescriptor = new EntityComponentDescriptor(this.component, listConfig);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentDescriptor.component);
    this.componentEntrypoint.viewContainerRef.clear();
    this.componentRef = this.componentEntrypoint.viewContainerRef.createComponent(componentFactory);

    // Copy the configuration to the component
    for (const key in componentDescriptor.data) {
      if (componentDescriptor.data.hasOwnProperty(key)) {
        console.debug(`Set @input ${key} to ${componentDescriptor.data[key]}`);
        this.componentRef.instance[key] = componentDescriptor.data[key];
      }
    }
  }
}
