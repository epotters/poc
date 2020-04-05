import {AfterContentInit, Directive, EventEmitter, Injector, Input, OnDestroy, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FloatLabelType} from '@angular/material/form-field';
import {Subject} from 'rxjs';
import {debounceTime, skip, takeUntil} from 'rxjs/operators';

import {ColumnConfig, EntityMeta, FieldEditorConfig, Identifiable, ValidatorDescriptor} from '.';


@Directive()
export abstract class BaseEditorRowComponent<T extends Identifiable> implements AfterContentInit, OnDestroy {

  @Input() readonly meta: EntityMeta<T>;
  @Input() readonly columns: string[];
  @Input() readonly floatLabel: FloatLabelType = 'never';
  @Output() readonly editorChange: EventEmitter<any> = new EventEmitter<any>();

  editorColumns: Record<string, FieldEditorConfig>;
  rowEditorForm: FormGroup;

  defaultFieldEditorConfig: FieldEditorConfig = {type: 'text'};
  enableValidation: boolean = false;
  visible: boolean = true;

  private debouncer: Subject<string> = new Subject<string>();
  private terminator: Subject<any> = new Subject();

  debounceTime: number = 300;

  protected constructor(
    public formBuilder: FormBuilder,
    public injector: Injector
  ) {
  }

  ngAfterContentInit() {
    this.editorColumns = this.getColumns();
    this.rowEditorForm = this.buildFormGroup();
    this.debouncer.pipe(debounceTime(this.debounceTime))
      .pipe(skip(1), takeUntil(this.terminator)).subscribe(() => {
      this.editorChange.emit(this.getOutputValue());
    });
    this.onChanges();
  }

  ngOnDestroy(): void {
    this.terminator.next();
    this.terminator.complete();
    this.debouncer.complete();
  }

  onChanges(): void {
    this.rowEditorForm.valueChanges.pipe(takeUntil(this.terminator)).subscribe(entityData => {
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
      for (const key in validatorDescriptors) {
        if (validatorDescriptors.hasOwnProperty(key)) {
          const validatorDescriptor: ValidatorDescriptor = validatorDescriptors[key];
          const validator = (validatorDescriptor.argument) ?
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

  getColumnEditor(key: string): FieldEditorConfig {
    const columnConfig: ColumnConfig = this.meta.columnConfigs[key];
    if (columnConfig && columnConfig.rowEditor) {
      return columnConfig.rowEditor;
    } else if (columnConfig && columnConfig.editor) {
      return columnConfig.editor;
    } else {
      return this.defaultFieldEditorConfig;
    }
  }

  // Validation
  hasErrors(key: string): boolean {
    const control: AbstractControl | null = this.rowEditorForm.get(key);
    return (this.enableValidation) ? ((!!control) ? control.valid : false) : false;
  }

  getErrorMessage(key: string): string {
    if (!this.enableValidation) {
      return '';
    }
    const errorMessages: string[] = [];
    const columnConfig: ColumnConfig = this.meta.columnConfigs[key];
    if (!!columnConfig.validators && columnConfig.validators.length > 0) {
      for (const validation of columnConfig.validators) {
        if (this.hasErrorOfType(key, validation.type)) {
          errorMessages.push(validation.message);
        }
      }
    }
    return errorMessages.join('\\n');
  }

  hasErrorOfType(fieldName: string, validationType: string): boolean {
    const formControl = this.rowEditorForm.get(fieldName);
    if (!!formControl) {
      return (formControl.hasError(validationType) && (formControl.dirty || formControl.touched));
    } else {
      return false;
    }
  }

  private buildFormGroup(): FormGroup {
    const group: { [key: string]: any } = {};
    for (const key in this.editorColumns) {
      if (this.editorColumns.hasOwnProperty(key)) {
        group[key] = new FormControl('', this.buildValidators(key));
      }
    }
    return this.formBuilder.group(group);
  }
}
