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

  protected constructor(
    public _elementRef: ElementRef<HTMLElement>,
    public injector: Injector,
    private _focusMonitor: FocusMonitor,
    controlType: string) {

    this.controlType = controlType;

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
  controlType: string;

  errorState = false;
  touched: boolean = false;
  focused: boolean = false;

  static nextId = 0;
  id = `${this.controlType}-${AbstractMatFormFieldControl.nextId++}`;


  @Input()
  get value(): T | null {
    return this._value;
  }

  set value(newValue: T | null) {

    // Hacky solution to avoid empty strings. The signature T | null shouldn't allow them but does
    if (!newValue && newValue !== null) {
      // console.debug('New value is an empty string, changing value to null');
      newValue = null;
    }

    if (newValue !== this.value) {
      console.debug('Set value to "' + newValue + '" (was "' + this.value + '")');
      this._value = newValue;
      this.setValue(newValue);
      this.onChange(newValue);
      this.stateChanges.next();
    } else {
      // console.debug('New value and current value are the same ("' + this.value + '"). Do nothing.');
    }
  }

  _value: T | null = null;


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


  @HostBinding('attr.aria-describedby') describedBy = '';

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    console.debug('Container clicked');
    this.focus();
  }


  // Implement Angular Lifecycle Hooks

  ngOnInit(): void {

    // Avoid cyclic dependency
    this.ngControl = this.injector.get(NgControl);
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this.setUpControl();

    console.debug('Initialized ' + this.controlType + ' named "' + this.ngControl.name + '"');
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
    this.value = value;
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
