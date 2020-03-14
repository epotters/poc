import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  forwardRef,
  Injector,
  Input,
  OnInit,
  Type,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import {MatFormFieldControl} from "@angular/material/form-field";
import {FormControl, NG_VALUE_ACCESSOR} from "@angular/forms";
import {EntityMeta, EntityService, Identifiable} from "..";
import {AbstractMatFormFieldControl} from "./abstract-mat-form-field-control";
import {FocusMonitor} from "@angular/cdk/a11y";
import {Router} from "@angular/router";
import {EntityComponentEntryPointDirective} from "../dialog/entity-component-entrypoint.directive";
import {EntityComponentDescriptor} from "../dialog/entity-component-dialog.component";
import {PersonListComponent} from "../../../people/person-list.component";


@Component({
  selector: 'entity-selector-list',
  templateUrl: './entity-selector-list.component.html',
  providers: [{
    provide: MatFormFieldControl,
    useExisting: EntitySelectorListComponent
  }, {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EntitySelectorListComponent),
    multi: true
  }],
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntitySelectorListComponent<T extends Identifiable> extends AbstractMatFormFieldControl<T> implements OnInit {

  static controlType: string = 'entity-selector-list';

  @Input() meta: EntityMeta<T>;
  @Input() service: EntityService<T>;
  @Input() listComponent: Type<any>;
  @Input() panelWidth: string = '300px';

  initialFilters: any = [];

  searchControl: FormControl = new FormControl();

  @ViewChild(EntityComponentEntryPointDirective, {static: true}) componentEntrypoint: EntityComponentEntryPointDirective;


  constructor(
    _elementRef: ElementRef<HTMLElement>,
    public injector: Injector,
    _focusMonitor: FocusMonitor,
    public router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(_elementRef, injector, _focusMonitor, EntitySelectorListComponent.controlType);

    console.debug('Constructing a EntitySelectorListComponent');
  }


  ngOnInit(): void {
    super.ngOnInit();
    console.debug('Initializing a EntitySelectorListComponent');
    const entityListComponentDescriptor = new EntityComponentDescriptor(PersonListComponent,
      {
        columns: this.meta.displayedColumnsDialog,
        title: 'Selector list',
        headerVisible: false,
        paginatorVisible: false,
        filterVisible: false,
        editorVisible: false,
        initialFilters: this.initialFilters
      });
    this.loadListComponent(entityListComponentDescriptor);
  }

// (selectedEntity)="onEntitySelected($event)"


  private loadListComponent(componentDescriptor: EntityComponentDescriptor) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentDescriptor.component);
    this.componentEntrypoint.viewContainerRef.clear();
    const componentRef = this.componentEntrypoint.viewContainerRef.createComponent(componentFactory);

    for (let key in componentDescriptor.data) {
      if (componentDescriptor.data.hasOwnProperty(key)) {
        console.debug(`Set @input ${key} to value ${componentDescriptor.data[key]}`);
        (<EntityComponentDescriptor>componentRef.instance as any)[key] = componentDescriptor.data[key];
      }
    }

    componentRef.instance.selectedEntity.subscribe(entity => {
      console.log('Entity selected', entity);
    });
  }

  onEntitySelected($event) {
    console.debug('Inside onEntitySelected');
  }


  // Implementations
  blur(): void {
  }

  focus(): void {
  }

  isEmpty(): boolean {
    return false;
  }

  setControlDisabledState(isDisabled: boolean): void {
  }

  setUpControl(): void {
  }

  setValue(value): void {
  }


}
