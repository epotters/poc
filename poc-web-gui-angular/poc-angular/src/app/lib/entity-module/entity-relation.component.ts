import {BehaviorSubject} from "rxjs";
import {ComponentFactoryResolver, Directive, Input, OnDestroy, OnInit, Type, ViewChild} from "@angular/core";
import {ColumnConfig, EntityMeta, RelationEntity} from "./domain/entity-meta.model";
import {Identifiable} from "./domain/identifiable.model";
import {EntityComponentDescriptor} from "./dialog/entity-component-dialog.component";
import {EntityComponentEntryPointDirective} from "./dialog/entity-component-entrypoint.directive";
import {ListConfig} from "./entity-list.component";


@Directive()
export abstract class EntityRelationComponent<T extends Identifiable, S extends Identifiable, R extends Identifiable>
  implements OnInit, OnDestroy {

  @Input() readonly ownerSubject: BehaviorSubject<S>;

  fieldName: string;
  component: Type<any>;
  visible: boolean = false;

  @ViewChild(EntityComponentEntryPointDirective, {static: true}) componentEntrypoint: EntityComponentEntryPointDirective;

  protected constructor(
    public meta: EntityMeta<T>,
    public ownerMeta: EntityMeta<S>,
    public relatedMeta: EntityMeta<R>,
    public componentFactoryResolver: ComponentFactoryResolver
  ) {
    console.debug('Constructing the EntityRelationComponent for relation ' + this.meta.displayName + ' between ' +
      this.ownerMeta.displayName + ' and ' + this.relatedMeta.displayName);
  }

  ngOnInit(): void {
    this.activateRelation();
  }

  ngOnDestroy(): void {
    this.ownerSubject.complete();
  }

  private activateRelation(): void {
    this.ownerSubject.asObservable().subscribe(owner => {
        if (!!owner && !!owner.id) {
          console.debug('Owner loaded, about to build relation ' + this.fieldName);
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
    console.debug('loadRelationList: ', owner, relationOverlay, this.ownerMeta, this.fieldName, columnConfig);

    const listConfig: ListConfig<T> = {
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

    console.debug('listConfig', listConfig);

    const componentDescriptor: EntityComponentDescriptor =
      new EntityComponentDescriptor(this.component, listConfig);

    console.debug(this.componentEntrypoint);

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentDescriptor.component);
    this.componentEntrypoint.viewContainerRef.clear();
    const componentRef = this.componentEntrypoint.viewContainerRef.createComponent(componentFactory);

    for (let key in componentDescriptor.data) {
      if (componentDescriptor.data.hasOwnProperty(key)) {
        console.debug('Set @input', key, 'to value', componentDescriptor.data[key]);
        (<EntityComponentDescriptor>componentRef.instance as any)[key] = componentDescriptor.data[key];
      }
    }
  }
}
