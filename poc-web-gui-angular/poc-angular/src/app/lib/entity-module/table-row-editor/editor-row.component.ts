import {Component, EventEmitter, Inject, Injector, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {EntityMeta, FieldEditorConfig} from "..";
import {BaseEditorRowComponent} from "./base-editor-row.component";
import {META} from "../entity-tokens";


@Component({
  selector: 'editor-row',
  templateUrl: './editor-row.component.html',
  styleUrls: ['./editor-row.component.css']
})
export class EditorRowComponent<T extends Identifiable> extends BaseEditorRowComponent<T> {

  @Output() readonly editorChange: EventEmitter<any> = new EventEmitter<any>();

  keySuffix = ''; // 'Editor';
  visible = false;

  constructor(
    @Inject(META) public meta: EntityMeta<any>,
    public formBuilder: FormBuilder,
    injector: Injector) {
    super(meta, formBuilder, injector);
    console.debug('Constructing EditorRowComponent for type ' + meta.displayName);
  }


  public loadEntity(entity: T) {
    if (entity) {
      let editorEntity: Partial<T> = this.prepareEntity(entity);
      this.rowEditorForm.setValue(editorEntity);
      this.rowEditorForm.markAsPristine();
    } else {
      this.rowEditorForm.reset();
    }
  }


  // Only include fields that are in the form and add key suffix to field names
  private prepareEntity(entity: T): Partial<T> {
    let editorEntity: Partial<T> = {};
    Object.entries(entity).forEach(
      ([key, value]) => {
        if (this.rowEditorForm.contains(key + this.keySuffix)) {
          editorEntity[key + this.keySuffix] = entity[key];
        } else {
          console.debug('Skipping property "' + key + '" because there is no control for it');
        }
      }
    );
    return editorEntity;
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

}

