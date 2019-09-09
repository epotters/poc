import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {EntityMeta, FieldEditorConfig} from "..";
import {BaseEditorRowComponent} from "./base-editor-row.component";


@Component({
  selector: 'editor-row',
  templateUrl: './editor-row.component.html',
  styleUrls: ['./editor-row.component.css']
})
export class EditorRowComponent<T extends Identifiable> extends BaseEditorRowComponent<T> {

  @Input() meta: EntityMeta<T>;
  @Output() readonly editorChange: EventEmitter<any> = new EventEmitter<any>();

  keySuffix = 'Editor';
  visible = false;

  constructor(
    public formBuilder: FormBuilder) {
    super(formBuilder);
    console.debug('Constructing EditorRowComponent');
  }


  getColumns(): Record<string, FieldEditorConfig> {
    let editorColumns: Record<string, FieldEditorConfig> = {};
    for (let idx in this.meta.displayedColumns) {
      let key: string = this.meta.displayedColumns[idx];
      if (this.meta.columnConfigs[key] && this.meta.columnConfigs[key].editor) {
        editorColumns[key] = this.meta.columnConfigs[key].editor;
      } else {
        editorColumns[key] = this.defaultFieldEditorConfig;
      }
    }
    return editorColumns;
  }


  onChanges(): void {
    this.rowEditorForm.valueChanges.subscribe(entityFilter => {
      console.debug('Editor form changed');
      console.debug(entityFilter);
      this.debouncer.next(entityFilter);
    });
  }
}

