import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {EntityMeta, FieldEditorConfig} from "..";
import {BaseEditorRowComponent} from "./base-editor-row.component";

@Component({
  selector: 'filter-row',
  templateUrl: './editor-row.component.html',
  styleUrls: ['./editor-row.component.css']
  // , changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterRowComponent<T extends Identifiable> extends BaseEditorRowComponent<T> {

  @Input() meta: EntityMeta<T>;
  @Output() readonly editorChange: EventEmitter<any> = new EventEmitter<any>();

  keySuffix: string = 'Filter';

  constructor(
    public formBuilder: FormBuilder,
    public changeDetector: ChangeDetectorRef
  ) {
    super(formBuilder, changeDetector);
    console.debug('Constructing FilterRowComponent');
  }

  getColumns(): Record<string, FieldEditorConfig> {
    console.debug('Set columns for FilterRowComponent');
    console.debug(this.meta);
    return this.meta.filteredColumns;
  }

}
