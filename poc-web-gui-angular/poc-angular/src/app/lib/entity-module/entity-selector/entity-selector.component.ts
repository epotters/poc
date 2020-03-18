// Source: https://github.com/OasisDigital/angular-material-search-select/blob/master/src/app/search-select/base.ts
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  Injector,
  Input,
  ViewEncapsulation
} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatFormFieldControl} from "@angular/material/form-field";
import {FocusMonitor} from "@angular/cdk/a11y";
import {EntityDataSource} from "../entity-data-source";
import {EntityMeta, EntityService, Identifiable} from "..";
import {AbstractMatFormFieldControl} from "./abstract-mat-form-field-control";
import {Params, Router} from "@angular/router";


@Component({
  selector: 'entity-selector',
  templateUrl: './entity-selector.component.html',
  providers: [{
    provide: MatFormFieldControl,
    useExisting: EntitySelectorComponent
  }, {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EntitySelectorComponent),
    multi: true
  }],
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntitySelectorComponent<T extends Identifiable> extends AbstractMatFormFieldControl<T> {

  static controlType: string = 'entity-selector';

  @Input() meta: EntityMeta<T>;
  @Input() service: EntityService<T>;
  @Input() autoActiveFirstOption: boolean = false;
  @Input() showClearButton: boolean = true;
  @Input() emptyText: string = 'Create new entity';

  dataSource: EntityDataSource<T>;
  searchControl: FormControl = new FormControl();

  createButtonVisible: boolean = false;
  lengthToShowCreate: number = 2;

  skipFirstChange: boolean = false;
  firstChange: boolean = true;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    focusMonitor: FocusMonitor,
    public injector: Injector,
    public router: Router
  ) {
    super(elementRef, focusMonitor, injector, EntitySelectorComponent.controlType);
  }


  focus() {
    console.debug('focus. current value:', this.value);
    this.focused = true;
  }

  blur() {
    console.debug('blur. current value:', this.value);
    this.onTouched();
    this.focused = false;
  }

  optionSelected(event) {
    console.debug('The user selected an option:', event.source.value);
    this.value = event.source.value;
  }

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

  private activateControl() {

    this.dataSource = new EntityDataSource<T>(this.meta, this.service);

    this.searchControl.valueChanges.subscribe(controlValue => {
      if (this.skipFirstChange && this.firstChange) {
        console.debug('Skip the first change');
        this.touched = false;
        this.firstChange = false;
        return;
      }
      if (controlValue) {
        if (typeof controlValue === 'string') {
          console.debug('The control value is a search string. Search for entities containing it', controlValue);
          this.dataSource.loadEntities([{name: this.meta.defaultSortField, rawValue: controlValue}],
            this.meta.defaultSortField, this.meta.defaultSortDirection, 0, this.meta.defaultPageSize);
        } else if (controlValue.id) {
          console.debug('The control value is an entity. Set the value directly');
          this.value = controlValue;
        } else {
          console.warn('Control value not recognized: "' + controlValue + '". This should not happen.');
        }
      } else {
        console.debug('No control value provided. Clearing the value');
        this.dataSource.clearEntities();
        this.value = null;
      }
    });


    this.dataSource.total$.subscribe(total => {
      if (total == 0 && typeof this.searchControl.value === 'string' && this.searchControl.value.length > this.lengthToShowCreate) {
        this.createButtonVisible = true;
      } else {
        this.createButtonVisible = false;
      }
    });
  }


  createNew() {
    console.debug(`Create a new ${this.meta.displayName.toLowerCase()}  with value ${this.searchControl.value}`);
    const queryParams: Params = {[this.meta.defaultSortField]: this.searchControl.value};
    this.router.navigate([this.meta.apiBase + '/new'], {queryParams: queryParams});
  }

  clearValue(): void {
    this.value = null;
  }

  // Custom methods
  setValue(value: T) {
    if (this.searchControl.value !== value) {
      this.searchControl.setValue(value);
    }
  }

  isEmpty() {
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

}
