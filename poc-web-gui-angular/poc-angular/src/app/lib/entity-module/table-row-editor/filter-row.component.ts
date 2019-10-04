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


  public setFilters(fieldFilters: FieldFilter[]): void {
    this.rowEditorForm.reset();
    for (let idx in fieldFilters) {
      let fieldFilter: FieldFilter = fieldFilters[idx];

      if (this.rowEditorForm.get(fieldFilter.name)) {
        this.rowEditorForm.get(fieldFilter.name).setValue(fieldFilter.rawValue);
        console.debug('---> fieldFilter', fieldFilter.name, 'set to', fieldFilter.rawValue);
      } else {
        console.debug('---> No field control for', fieldFilter.name);
      }

    }
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
