import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {EntityMeta, SelectOption} from "..";


export class EditorConfig {
  type: 'none' | 'text' | 'select' | 'date' = "none";
  options?: SelectOption[];
}


@Component({
  selector: 'editor-row',
  templateUrl: './editor-row.component.html',
  styleUrls: ['./editor-row.component.css']
})
export class EditorRowComponent<T extends Identifiable> implements OnInit, AfterViewInit {

  @Input() meta: EntityMeta<T>;
  @Output() readonly editorChange: EventEmitter<any> = new EventEmitter<any>();

  editorColumns: Record<string, EditorConfig>;
  keySuffix: string = 'Editor';
  debounceTime: number = 300;

  debouncer: Subject<string> = new Subject<string>();
  rowEditorForm: FormGroup;

  visible: boolean = true;

  constructor(
    public formBuilder: FormBuilder
  ) {
    console.debug('Constructing FilterRowComponent');
  }


  ngOnInit() {
    this.editorColumns = this.meta.filteredColumns;

    this.rowEditorForm = this.buildFormGroup();
    this.debouncer.pipe(debounceTime(this.debounceTime))
      .subscribe((val) => this.editorChange.emit(this.rowEditorForm.getRawValue()));
    this.onChanges();
  }


  ngAfterViewInit(): void {
    console.debug('AfterViewInit EditorRowComponent');
  }


  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  public clear() {
    this.rowEditorForm.reset();
  }

  onChanges(): void {
    this.rowEditorForm.valueChanges.subscribe(entityFilter => {
      console.debug('Editor form changed');
      console.debug(entityFilter);
      this.debouncer.next(entityFilter);
    });
  }


  private buildFormGroup(): FormGroup {
    let group = {};
    for (let key in this.editorColumns) {
      let editorConfig = this.editorColumns[key];
      group[key + this.keySuffix] = new FormControl('');
    }
    return this.formBuilder.group(group);
  }

}

