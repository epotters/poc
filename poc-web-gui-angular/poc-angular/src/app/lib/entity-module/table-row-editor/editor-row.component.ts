import {Component, Injector, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {BaseEditorRowComponent} from "./base-editor-row.component";
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from "@angular/material/tooltip";
import {ColumnConfig, FieldEditorConfig, Identifiable} from ".";


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
    console.debug('Creating EditorRowComponent');
    this.enableValidation = true;
  }

  ngOnInit(): void {
    console.debug('Initializing EditorRowComponent for type ' + this.meta.displayName);
  }


  public loadEntity(entity: T) {
    if (entity) {

      console.debug('Entity to load in the row editor:', entity);
      let editorEntity: Partial<T> = this.prepareEntity(entity);

      console.debug('Prepared entity to load in the row editor:', editorEntity);

      this.rowEditorForm.setValue(editorEntity);
      console.debug('About to mark form as pristine');
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
      let columnConfig: ColumnConfig = this.meta.columnConfigs[key];
      if (columnConfig && columnConfig.rowEditor) {
        editorColumns[key] = columnConfig.rowEditor;
      } else if (columnConfig && columnConfig.editor) {
        editorColumns[key] = columnConfig.editor;
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
          // @ts-ignore
          editorEntity[key] = entity[key];
        } else {
          console.debug(`Skipping field "${key}" because there is no control for it.`);
        }
      }
    );
    return editorEntity;
  }

}

