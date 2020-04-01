import {Component, Injector} from '@angular/core';
import {AbstractControl, FormBuilder} from '@angular/forms';
import {ColumnConfig, FieldEditorConfig, Identifiable} from '.';
import {BaseEditorRowComponent} from './base-editor-row.component';
import {FieldFilter} from '../domain/filter.model';


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

    console.debug('Start collecting field filters');
    const entityFilter: any = this.rowEditorForm.getRawValue();
    const fieldFilters: FieldFilter[] = [];

    Object.entries(entityFilter).forEach(
      ([key, value]) => {
        if (!!value && value !== '') {
          let fieldName: string = key;
          const type: any = this.getEditor(key).type;
          const columnConfig: ColumnConfig = this.meta.columnConfigs[key];
          if (type === 'entity-selector') {
            if (!(value as Identifiable)['id']) {
              console.debug(`No related entity to search for selected yet. Skipping ${value}.`);
              return;
            }
            fieldName = fieldName + '.id';
            value = (value as Identifiable)['id'];
            console.debug('Selected entity converted to id only for filter {', fieldName, ': ', value, '}');
          } else if (type === 'text' && !!columnConfig.editor && !!columnConfig.editor.relatedEntity) {
            console.debug('Searching related field ' + fieldName + ' as text');
            fieldName = fieldName + '.' + columnConfig.editor.relatedEntity.displayField;
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
    for (const idx in fieldFilters) {
      const fieldFilter: FieldFilter = fieldFilters[idx];
      const formControl: AbstractControl | null = this.rowEditorForm.get(fieldFilter.name);
      if (!!formControl) {
        formControl.setValue(fieldFilter.rawValue, {emitEvent: false});
        console.debug(`FieldFilter ${fieldFilter.name} set to ${fieldFilter.rawValue}`);
      } else {
        console.debug(`No field control for ${fieldFilter.name}. Skipping.`);
      }
    }
  }


  getColumns(): Record<string, FieldEditorConfig> {
    const editorColumns: Record<string, FieldEditorConfig> = {};
    for (const idx in this.columns) {
      const key: string = this.columns[idx];
      const columnConfig: ColumnConfig = this.meta.columnConfigs[key];
      if (columnConfig && columnConfig.filter) {
        editorColumns[key] = columnConfig.filter;
      } else {
        editorColumns[key] = this.getColumnEditor(key);
      }
    }
    return editorColumns;
  }


  getEditor(key: string): FieldEditorConfig {
    return (this.editorColumns[key]) ? this.editorColumns[key] : this.defaultFieldEditorConfig;
  }

}
