// Source: https://github.com/OasisDigital/angular-material-search-select/blob/master/src/app/search-select/base.ts
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  Injector,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatFormFieldControl} from "@angular/material/form-field";
import {FocusMonitor} from "@angular/cdk/a11y";
import {EntityDataSource} from "../entity-data-source";
import {EntityMeta, EntityService, Identifiable} from "..";
import {MatInput} from "@angular/material/input";
import {AbstractMatFormFieldControl} from "./abstract-mat-form-field-control";


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

  @Input() debounceTime = 100;

  @Input() meta: EntityMeta<T>;
  @Input() service: EntityService<T>;

  @Input() autoActiveFirstOption = false;
  @Input() emptyText = '';

  @ViewChild('input') searchInput: MatInput;

  dataSource: EntityDataSource<T>;

  searchControl = new FormControl();
  emptyObs: Observable<boolean>;
  errorMessage: Observable<string | undefined>;

  skipFirstChange: boolean = false;
  firstChange: boolean = true;


  constructor(
    _elementRef: ElementRef<HTMLElement>,
    public injector: Injector,
    _focusMonitor: FocusMonitor
  ) {
    super(_elementRef, injector, _focusMonitor, 'entity-selector');
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
    console.debug('controlValue to display:', controlValue);
    if (controlValue == null) {
      return '';
    } else if (typeof controlValue === 'string') {
      return controlValue;
    } else if (!!controlValue.id) {
      return this.meta.displayNameRenderer(controlValue);
    } else {
      console.debug('Unrecognized control value', controlValue);
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

          // console.debug('The control value is an entity. Look it up by its id');
          // this.dataSource.loadEntities([{name: 'id', rawValue: controlValue.id}],
          //   this.meta.defaultSortField, this.meta.defaultSortDirection, 0, this.meta.defaultPageSize);
          //
        } else {
          console.debug('Control value not recognized: "' + controlValue + '". This should not happen.');
        }
      } else {
        console.debug('No control value provided. Clearing the value');
        this.value = null;
      }
    });
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
