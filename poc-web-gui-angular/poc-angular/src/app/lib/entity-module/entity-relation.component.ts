import { ComponentFactoryResolver, Input, OnDestroy, OnInit, Type, ViewChild, Directive } from "@angular/core";
import {ColumnConfig, EntityMeta} from "./domain/entity-meta.model";
import {BehaviorSubject} from "rxjs";
import {EntityComponentDescriptor} from "./dialog/entity-component-dialog.component";
import {EntityComponentEntryPointDirective} from "./dialog/entity-component-entrypoint.directive";
import {ListConfig} from "./entity-list.component";
import {Identifiable} from "./domain/identifiable.model";


@Directive()
export abstract class EntityRelationComponent<T extends Identifiable, S extends Identifiable, R extends Identifiable>
  implements OnInit, OnDestroy {

  @Input() readonly ownerSubject: BehaviorSubject<S>;

  fieldName: string;
  component: Type<any>;
  visible: boolean = false;

  @ViewChild(EntityComponentEntryPointDirective, {static: true}) componentEntrypoint: EntityComponentEntryPointDirective;

  constructor(
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
        if (owner) {
          console.debug('Owner loaded, about to build relation', this.fieldName);
          this.visible = true;
          this.loadRelationList(owner);
        } else {
          console.debug('No owner loaded yet');
        }
      }
    );
  }


  // Load the table
  private loadRelationList(owner: S) {

    const columnConfig: ColumnConfig = this.ownerMeta.columnConfigs[this.fieldName];
    const relationOverlay = {};

    relationOverlay[columnConfig.editor.relationEntity.owner] = owner;

    console.debug('loadRelationList: ', owner, relationOverlay, this.ownerMeta, this.fieldName, columnConfig);

    const listConfig: ListConfig<T> = {
      title: columnConfig.label,
      columns: columnConfig.editor.relationEntity.columns,
      overlay: relationOverlay,
      initialSort: columnConfig.editor.relationEntity.sort,
      initialSortDirection: columnConfig.editor.relationEntity.sortDirection,
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
