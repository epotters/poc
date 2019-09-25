import {Component, EventEmitter, Inject, Injector, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
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
    for (let idx in this.meta.displayedColumns) {
      let key: string = this.meta.displayedColumns[idx];
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

  getOutputValue(): FieldFilter[] {
    let entityFilter: any = this.rowEditorForm.getRawValue();
    let fieldFilters: FieldFilter[] = [];
    Object.entries(entityFilter).forEach(
      ([key, value]) => {
        if (value && value !== '') {
          let name: string = key.substring(0, (key.length - this.keySuffix.length));
          fieldFilters.push({
            name: name,
            rawValue: (value as string)
          })
        }
      }
    );
    return fieldFilters;
  }

}
