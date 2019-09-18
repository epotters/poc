import {Component, EventEmitter, Inject, Injector, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {EntityMeta, FieldEditorConfig} from "..";
import {BaseEditorRowComponent} from "./base-editor-row.component";
import {META} from "../entity-tokens";
import {MAT_DATE_FORMATS} from "@angular/material/core";


@Component({
  selector: 'filter-row',
  templateUrl: './editor-row.component.html',
  styleUrls: ['./editor-row.component.css']
})
export class FilterRowComponent<T extends Identifiable> extends BaseEditorRowComponent<T> {

  @Output() readonly editorChange: EventEmitter<any> = new EventEmitter<any>();

  keySuffix: string = 'Filter';

  constructor(
    @Inject(META) public meta: EntityMeta<any>,
    @Inject(MAT_DATE_FORMATS) dateFormats,
    public formBuilder: FormBuilder,
    injector: Injector) {
    super(meta, formBuilder, injector);
    console.debug('Constructing FilterRowComponent for type ' + meta.displayName);

    console.debug(dateFormats);
  }

  getColumns(): Record<string, FieldEditorConfig> {
    return this.meta.filteredColumns;
  }

}
