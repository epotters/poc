import {Component, EventEmitter, Inject, Injector, Input, Output} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {EntityMeta, FieldEditorConfig} from "..";
import {BaseEditorRowComponent} from "./base-editor-row.component";
import {META} from "../entity-tokens";
import {FieldFilter} from "../domain/filter.model";


@Component({
  selector: 'filter-row',
  templateUrl: './editor-row.component.html',
  styleUrls: ['./editor-row.component.css']
})
export class FilterRowComponent<T extends Identifiable> extends BaseEditorRowComponent<T> {

  @Input() readonly columns: string[];
  @Output() readonly editorChange: EventEmitter<any> = new EventEmitter<any>();


  keySuffix: string = ''; // 'Filter';

  constructor(
    @Inject(META) public meta: EntityMeta<any>,
    public formBuilder: FormBuilder,
    injector: Injector) {
    super(meta, formBuilder, injector);

    console.debug('Constructing FilterRowComponent for type ' + meta.displayName);
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
        filter[fieldFilter.name] = fieldFilter.rawValue;
        console.debug('---> Setting filter to', fieldFilter);
      }
      this.rowEditorForm.setValue(filter);
    } else {
      this.rowEditorForm.reset();
    }
  }


  getOutputValue(): FieldFilter[] {

    console.debug('---> Start building form output value');
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
    console.debug('---> Finished building form output value: ', fieldFilters);
    return fieldFilters;
  }


}
