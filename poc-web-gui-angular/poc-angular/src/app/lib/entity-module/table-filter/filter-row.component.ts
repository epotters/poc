import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {EditorRowComponent} from "./editor-row.component";
import {EntityMeta} from "..";

@Component({
  selector: 'filter-row',
  templateUrl: './editor-row.component.html',
  styleUrls: ['./editor-row.component.css']
})
export class FilterRowComponent<T extends Identifiable> extends EditorRowComponent<T> {

  @Input() meta: EntityMeta<T>;
  @Output() readonly editorChange: EventEmitter<any> = new EventEmitter<any>();

  keySuffix: string = 'Filter';
  editorColumns;

  constructor(
    public formBuilder: FormBuilder
  ) {
    super(formBuilder);
    console.debug('Constructing FilterRowComponent');
  }

  onAfterViewInit() {
   this.editorColumns = this.meta.filteredColumns;
  }

}
