import {Component, Injector, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {FieldEditorConfig} from "..";
import {BaseEditorRowComponent} from "./base-editor-row.component";
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from "@angular/material/tooltip";


export const InlineEditorTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000
};


@Component({
  selector: 'editor-row',
  templateUrl: './editor-row.component.html',
  styleUrls: ['./editor-row.component.css'],
  providers: [
    {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: InlineEditorTooltipDefaults}
  ],
})
export class EditorRowComponent<T extends Identifiable> extends BaseEditorRowComponent<T> implements OnInit {

  visible = false;

  constructor(
    public formBuilder: FormBuilder,
    injector: Injector) {
    super(formBuilder, injector);
    console.debug('Constructing EditorRowComponent');
    this.enableValidation = true;
  }

  ngOnInit(): void {
    console.debug('Initializing EditorRowComponent for type ' + this.meta.displayName);
  }


  public loadEntity(entity: T) {
    if (entity) {
      let editorEntity: Partial<T> = this.prepareEntity(entity);
      this.rowEditorForm.setValue(editorEntity);
      this.rowEditorForm.markAsPristine();
    } else {
      console.debug('Clearing the editor');
      this.rowEditorForm.reset();
    }
  }

  getColumns(): Record<string, FieldEditorConfig> {
    let editorColumns: Record<string, FieldEditorConfig> = {};
    for (let idx in this.columns) {
      let key: string = this.columns[idx];
      if (this.meta.columnConfigs[key] && this.meta.columnConfigs[key].rowEditor) {
        console.debug('rowEditor config found for field', key, ':', this.meta.columnConfigs[key].rowEditor);
        editorColumns[key] = this.meta.columnConfigs[key].rowEditor;
      } else if (this.meta.columnConfigs[key] && this.meta.columnConfigs[key].editor) {
        editorColumns[key] = this.meta.columnConfigs[key].editor;
      } else {
        editorColumns[key] = this.defaultFieldEditorConfig;
      }
    }
    return editorColumns;
  }

  // Only include fields that are in the form
  private prepareEntity(entity: T): Partial<T> {
    let editorEntity: Partial<T> = {};
    Object.entries(entity).forEach(
      ([key, value]) => {
        if (this.rowEditorForm.contains(key)) {
          editorEntity[key] = entity[key];
        } else {
          console.debug('Skipping field "', key, '" because there is no control for it');
        }
      }
    );
    return editorEntity;
  }

}

