import {Subject, Subscription} from "rxjs";
import {debounceTime} from "rxjs/operators";

import {AfterContentInit, Directive, EventEmitter, Injector, Input, OnDestroy, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import {EntityMeta, FieldEditorConfig, Identifiable, ValidatorDescriptor} from ".";


@Directive()
export abstract class BaseEditorRowComponent<T extends Identifiable> implements AfterContentInit {

  @Input() readonly meta: EntityMeta<T>;
  @Input() readonly columns: string[];
  @Output() readonly editorChange: EventEmitter<any> = new EventEmitter<any>();

  editorColumns: Record<string, FieldEditorConfig>;
  rowEditorForm: FormGroup;

  defaultFieldEditorConfig: FieldEditorConfig = {type: 'text'};
  enableValidation: boolean = false;
  debouncer: Subject<string> = new Subject<string>();
  visible: boolean = true;

  subscription: Subscription;
  firstChangeEvent: boolean = true;

  debounceTime: number = 300;

  constructor(
    public formBuilder: FormBuilder,
    public injector: Injector
  ) {
  }

  ngAfterContentInit() {
    this.editorColumns = this.getColumns();
    this.rowEditorForm = this.buildFormGroup();
    this.debouncer.pipe(debounceTime(this.debounceTime))
      .subscribe(() => {
        if (this.firstChangeEvent) {
          this.firstChangeEvent = false;
        } else {
          this.editorChange.emit(this.getOutputValue());
        }
      });
    this.onChanges();
  }

  onChanges(): void {
    this.rowEditorForm.valueChanges.subscribe(entityData => {
      this.debouncer.next(entityData);
    });
  }

  getOutputValue(): any {
    return this.rowEditorForm.getRawValue();
  }

  public clear(): void {
    this.rowEditorForm.reset();
  }

  buildValidators(fieldName: string): any[] {
    if (!this.enableValidation) {
      return [];
    }

    if (fieldName.indexOf('.') > -1) {
      fieldName = fieldName.split('.')[0];
    }

    const validators: any[] = [];
    const validatorDescriptors = this.meta.columnConfigs[fieldName].validators;
    if (validatorDescriptors) {
      for (let key in validatorDescriptors) {
        if (validatorDescriptors.hasOwnProperty(key)) {
          let validatorDescriptor: ValidatorDescriptor = validatorDescriptors[key];
          let validator = (validatorDescriptor.argument) ?
            Validators[validatorDescriptor.type](validatorDescriptor.argument) :
            Validators[validatorDescriptor.type];
          validators.push(validator);
        }
      }
    }
    return validators;
  }

  abstract getColumns(): Record<string, FieldEditorConfig>;

  getEditor(key: string): FieldEditorConfig {
    return (this.editorColumns[key]) ? this.editorColumns[key] : this.defaultFieldEditorConfig;
  }

  hasErrors(key: string): boolean {
    return (this.enableValidation) ? this.rowEditorForm.get(key).valid : false;
  }

  getErrorMessage(key: string): string {
    if (!this.enableValidation) {
      return '';
    }
    const errorMessages: string[] = [];
    if (this.meta.columnConfigs[key].validators && this.meta.columnConfigs[key].validators.length > 0) {
      for (let validation of this.meta.columnConfigs[key].validators) {
        if (this.hasErrorOfType(key, validation.type)) {
          errorMessages.push(validation.message);
        }
      }
    }
    return errorMessages.join('\\n');
  }

  hasErrorOfType(fieldName: string, validationType: string): boolean {
    const formControl = this.rowEditorForm.get(fieldName);
    return (formControl.hasError(validationType) && (formControl.dirty || formControl.touched));
  }

  private buildFormGroup(): FormGroup {
    let group = {};
    for (let key in this.editorColumns) {
      if (this.editorColumns.hasOwnProperty(key)) {
        group[key] = new FormControl('', this.buildValidators(key));
      }
    }
    return this.formBuilder.group(group);
  }
}
