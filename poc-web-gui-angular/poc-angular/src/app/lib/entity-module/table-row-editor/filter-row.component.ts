import {Component, Injector} from '@angular/core';
import {AbstractControl, FormBuilder} from "@angular/forms";
import {ColumnConfig, FieldEditorConfig, Identifiable} from ".";
import {BaseEditorRowComponent} from "./base-editor-row.component";
import {FieldFilter} from "../domain/filter.model";


@Component({
  selector: 'filter-row',
  templateUrl: './editor-row.component.html',
  styleUrls: ['./editor-row.component.css']
})
export class FilterRowComponent<T extends Identifiable> extends BaseEditorRowComponent<T> {

  constructor(
    public formBuilder: FormBuilder,
    injector: Injector) {
    super(formBuilder, injector);

    console.debug('Creating FilterRowComponent');
  }

  getOutputValue(): FieldFilter[] {
    return this.getFilters()
  }

  public getFilters(): FieldFilter[] {

    console.debug('Start building form output value');
    const entityFilter: any = this.rowEditorForm.getRawValue();
    const fieldFilters: FieldFilter[] = [];

    Object.entries(entityFilter).forEach(
      ([key, value]) => {

        if (!!value && value !== '') {
          let fieldName: string = key;
          let type: any = this.getEditor(key).type;

          if (type == 'entity-selector') {
            if (!(value as Identifiable)['id']) {
              console.debug('No related entity to search for selected yet. Skipping.');
              return;
            }
            fieldName = fieldName + '.id';
            value = (value as Identifiable)['id'];
            console.debug('Selected entity converted to id only for filter {', fieldName, ': ', value, '}');
          }

          fieldFilters.push({
            name: fieldName,
            rawValue: (value as string)
          });
        }
      }
    );
    console.debug('Finished building form output value: ', fieldFilters);
    return fieldFilters;
  }


  public setFilters(fieldFilters: FieldFilter[]): void {
    this.rowEditorForm.reset();
    for (let idx in fieldFilters) {
      let fieldFilter: FieldFilter = fieldFilters[idx];
      let formControl: AbstractControl | null = this.rowEditorForm.get(fieldFilter.name);
      if (!!formControl) {
        formControl.setValue(fieldFilter.rawValue, {emitEvent: false});
        console.debug('---> fieldFilter', fieldFilter.name, 'set to', fieldFilter.rawValue);
      } else {
        console.debug('---> No field control for', fieldFilter.name);
      }
    }
  }


  getColumns(): Record<string, FieldEditorConfig> {
    let editorColumns: Record<string, FieldEditorConfig> = {};
    for (let idx in this.columns) {
      let key: string = this.columns[idx];
      let columnConfig: ColumnConfig = this.meta.columnConfigs[key];
      if (columnConfig && columnConfig.filter) {
        console.debug('filter config found for field', key, ':', columnConfig.filter);
        editorColumns[key] = columnConfig.filter;
      } else if (columnConfig && columnConfig.rowEditor) {
        console.debug('rowEditor config found for field', key, ':', columnConfig.rowEditor);
        editorColumns[key] = columnConfig.rowEditor;
      } else if (columnConfig && columnConfig.editor) {
        editorColumns[key] = columnConfig.editor;
      } else {
        editorColumns[key] = this.defaultFieldEditorConfig;
      }
    }
    return editorColumns;
  }


  getEditor(key: string): FieldEditorConfig {
    return (this.editorColumns[key]) ? this.editorColumns[key] : this.defaultFieldEditorConfig;
  }

}
