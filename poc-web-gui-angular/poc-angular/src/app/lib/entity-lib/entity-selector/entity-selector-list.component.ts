import {FocusMonitor} from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  forwardRef,
  Injector,
  Input,
  OnDestroy,
  Type,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatFormFieldControl} from '@angular/material/form-field';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {EditableListConfig, EntityListComponent, EntityMeta, EntityService, Identifiable} from '..';
import {EntityComponentDescriptor} from '../common/component-loader/component-loader';
import {
  EntityComponentEntryPointDirective
} from '../common/component-loader/entity-component-entrypoint.directive';

import {AbstractMatFormFieldControl} from './abstract-mat-form-field-control';


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
export class EntitySelectorListComponent<T extends Identifiable> extends AbstractMatFormFieldControl<T>
  implements OnDestroy {

  static controlType: string = 'entity-selector-list';

  @Input() meta: EntityMeta<T>;
  @Input() service: EntityService<T>;
  @Input() showClearButton: boolean = true;

  @Input() listComponent: Type<any>;
  @Input() panelWidth: string = '300px';
  @Input() columns: string[] = [];

  searchControl: FormControl = new FormControl();
  listComponentRef: ComponentRef<EntityListComponent<T>>;
  initialFilters: any = [];

  @ViewChild(EntityComponentEntryPointDirective, {static: true}) componentEntrypoint: EntityComponentEntryPointDirective;
  @ViewChild(MatAutocompleteTrigger, {static: true}) autocompleteTrigger: MatAutocompleteTrigger;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    focusMonitor: FocusMonitor,
    public injector: Injector,
    public router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(elementRef, focusMonitor, injector, EntitySelectorListComponent.controlType);
    console.debug('Constructing a EntitySelectorListComponent');
  }


  ngOnDestroy() {
    super.ngOnDestroy();
    this.listComponentRef.destroy();
  }

  private activateControl() {

    const listConfig: EditableListConfig<T> = {
      columns: this.columns,
      title: 'Selector list',
      toolbarVisible: false,
      headerVisible: false,
      paginatorVisible: false,
      filterVisible: true,
      editorVisible: false,
      initialFilters: this.initialFilters,
      isManaged: true
    };

    const entityListComponentDescriptor = new EntityComponentDescriptor(this.listComponent, listConfig);
    this.loadListComponent(entityListComponentDescriptor);
  }


  private loadListComponent(componentDescriptor: EntityComponentDescriptor) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentDescriptor.component);
    this.componentEntrypoint.viewContainerRef.clear();
    this.listComponentRef = this.componentEntrypoint.viewContainerRef.createComponent(componentFactory);

    // Copy the configuration to the component
    for (const key in componentDescriptor.data) {
      if (componentDescriptor.data.hasOwnProperty(key)) {
        console.debug(`Set @input ${key} to value ${componentDescriptor.data[key]}`);
        this.listComponentRef.instance[key] = componentDescriptor.data[key];
      }
    }

    // Override the list's onclick method
    this.listComponentRef.instance.onClick = function (event: MouseEvent, entity: T) {
      this.selectEntity(entity);
    };

    // Listen for selected entities
    this.listComponentRef.instance.selectedEntity.pipe(takeUntil(this.terminator)).subscribe(entity => {
      console.debug('Entity selected', entity);
      this.value = entity;
    });
  }

  // Common

  public displayWith(controlValue?: T | string | null): string {
    if (controlValue == null) {
      return '';
    } else if (typeof controlValue === 'string') {
      return controlValue;
    } else if (!!controlValue.id) {
      return this.meta.displayNameRenderer(controlValue);
    } else {
      console.warn('Unrecognized control value', controlValue);
      return '';
    }
  }

  clearValue(): void {
    this.value = null;
  }


  // Implementations
  focus() {
    this.focused = true;
  }

  blur() {
    this.onTouched();
    this.focused = false;
  }

  isEmpty(): boolean {
    return !this.searchControl.value && !this.value;
  }

  setControlDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.searchControl.disable();
    } else {
      this.searchControl.enable();
    }
  }

  setUpControl(): void {
    this.activateControl();
  }

  setValue(value: T) {
    if (this.searchControl.value !== value) {
      this.searchControl.setValue(value);
      this.autocompleteTrigger.closePanel();
    }
  }

}
