import {Component, Injector, Input} from "@angular/core";
import {AbstractControl} from "@angular/forms";
import {FloatLabelType} from "@angular/material/form-field";
import {ColumnConfig, EntityMeta, FieldEditorConfig, Identifiable} from "..";

@Component({
  selector: 'editor-field',
  templateUrl: './editor-field.component.html'
})
export class EditorFieldComponent<T extends Identifiable> {

  @Input() readonly meta: EntityMeta<T>;
  @Input() readonly fieldName: string;
  @Input() readonly control: AbstractControl | null;
  @Input() readonly floatLabel: FloatLabelType = 'auto';

  columnConfig: ColumnConfig;
  defaultFieldEditorConfig: FieldEditorConfig = {type: 'text'};
  enableValidation: boolean = false;


  constructor(public injector: Injector) {
    this.columnConfig = this.meta.columnConfigs[this.fieldName];
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
      for (let validation of this.columnConfig.validators) {
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
