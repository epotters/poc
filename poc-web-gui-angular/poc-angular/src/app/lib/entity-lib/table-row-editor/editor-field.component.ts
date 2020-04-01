import {Component, Injector, Input, OnInit} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {FloatLabelType} from '@angular/material/form-field';
import {ColumnConfig, FieldEditorConfig, Identifiable} from '..';

@Component({
  selector: 'editor-field',
  templateUrl: './editor-field.component.html'
})
export class EditorFieldComponent<T extends Identifiable> implements OnInit {

  @Input() readonly formGroup: FormGroup;
  @Input() readonly fieldName: string;
  @Input() readonly columnConfig: ColumnConfig;

  @Input() readonly floatLabel: FloatLabelType = 'auto';


  defaultFieldEditorConfig: FieldEditorConfig = {type: 'text'};
  enableValidation: boolean = false;

  private control: AbstractControl | null;


  constructor(public injector: Injector) {
  }

  ngOnInit(): void {
    this.control = this.formGroup.get(this.fieldName);
  }


  getEditor(): FieldEditorConfig {
    return (this.columnConfig.editor) ? this.columnConfig.editor : this.defaultFieldEditorConfig;
  }

  hasErrors(): boolean {
    return (this.enableValidation) ? ((!!this.control) ? this.control.valid : false) : false;
  }

  getErrorMessage(): string {
    if (!this.enableValidation) {
      return '';
    }
    const errorMessages: string[] = [];
    if (!!this.columnConfig.validators && this.columnConfig.validators.length > 0) {
      for (const validation of this.columnConfig.validators) {
        if (this.hasErrorOfType(validation.type)) {
          errorMessages.push(validation.message);
        }
      }
    }
    return errorMessages.join('\\n');
  }

  hasErrorOfType(validationType: string): boolean {
    if (!!this.control) {
      return (this.control.hasError(validationType) && (this.control.dirty || this.control.touched));
    } else {
      return false;
    }
  }


}
