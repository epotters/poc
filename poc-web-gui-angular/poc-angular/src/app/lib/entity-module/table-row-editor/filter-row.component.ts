import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {EntityMeta, FieldEditorConfig} from "..";
import {BaseEditorRowComponent} from "./base-editor-row.component";


@Component({
  selector: 'filter-row',
  templateUrl: './editor-row.component.html',
  styleUrls: ['./editor-row.component.css']
})
export class FilterRowComponent<T extends Identifiable> extends BaseEditorRowComponent<T> {

  @Input() meta: EntityMeta<T>;
  @Output() readonly editorChange: EventEmitter<any> = new EventEmitter<any>();

  keySuffix: string = 'Filter';

  constructor(
    public formBuilder: FormBuilder) {
    super(formBuilder);
    console.debug('Constructing FilterRowComponent');
  }

  getColumns(): Record<string, FieldEditorConfig> {
    return this.meta.filteredColumns;
  }

}
