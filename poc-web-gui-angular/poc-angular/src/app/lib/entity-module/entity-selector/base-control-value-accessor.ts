import {ControlValueAccessor} from '@angular/forms';


// Source: https://medium.com/@narthur157/custom-angular-reactive-forms-what-i-wish-i-knew-v5-6-5b1c2f8e1974

export class BaseControlValueAccessor<T> implements ControlValueAccessor {
  public disabled = false;

  /**
   * Call when value has changed programmatically
   */
  public onChange(newVal: T) {
  }

  public onTouched(_?: any) {
  }

  public value: T;

  /**
   * Model -> View changes
   */
  public writeValue(obj: T): void {
    this.value = obj;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
