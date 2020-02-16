import {Subject} from "rxjs";
import {Directive, DoCheck, ElementRef, HostBinding, Injector, Input, OnDestroy, OnInit} from "@angular/core";
import {ControlValueAccessor, NgControl} from "@angular/forms";
import {MatFormFieldControl} from "@angular/material/form-field";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {FocusMonitor} from "@angular/cdk/a11y";
import {Identifiable} from "..";


// Source: https://medium.com/@sermicromegas/i-can-help-this-is-the-source-code-of-the-component-with-some-adjustments-tested-on-angular-9-b0d251c07651

@Directive()
export abstract class AbstractMatFormFieldControl<T extends Identifiable> implements OnInit, OnDestroy, DoCheck, ControlValueAccessor, MatFormFieldControl<T> {

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    public injector: Injector,
    private _focusMonitor: FocusMonitor) {

    _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
      if (this.focused && !origin) {
        this.onTouched();
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }


  // Implement MatFormFieldControl

  stateChanges = new Subject<void>();

  ngControl: any;
  controlType: string = 'abstract-mat-form-field-control';

  errorState = false;
  touched: boolean = false;
  focused: boolean = false;

  static nextId = 0;
  id = `${this.controlType}-${AbstractMatFormFieldControl.nextId++}`;


  @Input()
  get value(): T | null {
    return this._value;
  }

  set value(value: T | null) {
    if (value !== this.value) {
      console.debug('Value changed from', this.value, 'to', value);
      this._value = value;
      this.setValue(value);
      this.onChange(value);
      this.stateChanges.next();
    } else {
      console.debug('New value and current value are the same. Do nothing', this.value, value);
    }
  }

  _value: T;


  get empty() {
    return this.isEmpty();
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  private _placeholder: string;

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.setDisabledState(this._disabled);
    this.stateChanges.next();
  }

  private _disabled = false;


  // describedBy = '';
  @HostBinding('attr.aria-describedby') describedBy = '';

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    console.debug('Container clicked');
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this._elementRef.nativeElement.querySelector('input')!.focus();
    }
  }


  // Implement Angular phase handlers

  ngOnInit(): void {

    // Avoid cyclic dependency
    this.ngControl = this.injector.get(NgControl);
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this.setUpControl();
  }

  ngDoCheck(): void {
    if (this.ngControl) {
      this.errorState = this.ngControl.invalid && this.ngControl.touched && !this.focused;
      this.stateChanges.next();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }


  // Implement ControlValueAccessor

  writeValue(value: T | null): void {
    console.debug('@writeValue About to write value', value);
    // Angular sometimes writes a value that didn't change
    if (this.value !== value) {
      this.value = value;
    }
  }


  // Call when value has changed programmatically
  onChange = (value: any) => {
  };

  registerOnChange(fn: (v: any) => void): void {
    this.onChange = fn;
  }

  onTouched = () => {
  };

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.setControlDisabledState(isDisabled);
  }


  // Methods to implement in the custom mat form field control

  abstract setUpControl(): void;

  abstract setValue(value): void;

  abstract focus(): void;

  abstract blur(): void;

  abstract isEmpty(): boolean

  abstract setControlDisabledState(isDisabled: boolean): void;

}
