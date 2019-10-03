import {Component, Injector} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {FieldEditorConfig} from "..";
import {BaseEditorRowComponent} from "./base-editor-row.component";
import {FieldFilter} from "../domain/filter.model";


@Component({
  selector: 'filter-row',
  templateUrl: './editor-row.component.html',
  styleUrls: ['./editor-row.component.css']
})
export class FilterRowComponent<T extends Identifiable> extends BaseEditorRowComponent<T> {

  keySuffix: string = ''; // 'Filter';

  constructor(
    public formBuilder: FormBuilder,
    injector: Injector) {
    super(formBuilder, injector);

    console.debug('Constructing FilterRowComponent');
  }

  ngOnInit(): void {
    console.debug('Initializing FilterRowComponent for type ' + this.meta.displayName);
  }


  public setFilters(fieldFilters: FieldFilter[]): void {
    if (fieldFilters.length > 0) {
      const filter: any = {};
      for (let key in this.editorColumns) {
        if (this.editorColumns.hasOwnProperty(key)) {
          filter[key] = '';
        }
      }
      for (let idx in fieldFilters) {
        let fieldFilter: FieldFilter = fieldFilters[idx];
        console.debug('---> fieldFilters, idx, fieldFilter', fieldFilters, idx, fieldFilter);

        if (filter[fieldFilter.name]) {
          filter[fieldFilter.name] = fieldFilter.rawValue;
          console.debug('Setting filter to', fieldFilter);
        } else {
          console.debug(fieldFilter.name, 'is not a part of the filter form');
        }
      }
      this.rowEditorForm.setValue(filter);
    } else {
      this.rowEditorForm.reset();
    }
  }


  public getFilters(): FieldFilter[] {

    console.debug('Start building form output value');
    const entityFilter: any = this.rowEditorForm.getRawValue();
    const fieldFilters: FieldFilter[] = [];

    Object.entries(entityFilter).forEach(
      ([key, value]) => {

        if (value && value !== '') {
          let name: string = key.substring(0, (key.length - this.keySuffix.length));
          let type: any = this.getEditor(key).type;

          if (type == 'autocomplete') {
            if (!value['id']) {
              console.debug('No related entity to search for selected yet. Skipping.');
              return;
            }
            name = name + '.id';
            value = value['id'];
            console.debug('Selected entity converted to id only for filter {', name, ': ', value, '}');
          }

          fieldFilters.push({
            name: name,
            rawValue: (value as string)
          });
        }
      }
    );
    console.debug('Finished building form output value: ', fieldFilters);
    return fieldFilters;
  }


  getOutputValue(): FieldFilter[] {
    return this.getFilters()
  }


  getColumns(): Record<string, FieldEditorConfig> {
    let editorColumns: Record<string, FieldEditorConfig> = {};
    for (let idx in this.columns) {
      let key: string = this.columns[idx];
      if (this.meta.columnConfigs[key] && this.meta.columnConfigs[key].filter) {
        editorColumns[key] = this.meta.columnConfigs[key].filter;
      } else if (this.meta.columnConfigs[key] && this.meta.columnConfigs[key].editor) {
        editorColumns[key] = this.meta.columnConfigs[key].editor;
      } else {
        editorColumns[key] = this.defaultFieldEditorConfig;
      }
    }
    return editorColumns;
  }

}
