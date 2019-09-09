import {AfterViewInit, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {EntityMeta, FieldEditorConfig} from "..";


export abstract class BaseEditorRowComponent<T extends Identifiable> implements OnInit {

  @Input() meta: EntityMeta<T>;
  @Output() readonly editorChange: EventEmitter<any> = new EventEmitter<any>();

  editorColumns: Record<string, FieldEditorConfig>;
  keySuffix: string;
  debounceTime: number = 300;

  defaultFieldEditorConfig: FieldEditorConfig = {type: 'text'};

  debouncer: Subject<string> = new Subject<string>();
  rowEditorForm: FormGroup;

  visible: boolean = true;

  constructor(
    public formBuilder: FormBuilder
  ) {
    console.debug('Constructing BaseEditorRowComponent');
  }

  abstract getColumns(): Record<string, FieldEditorConfig>;

  getEditor(key: string): FieldEditorConfig {
    return (this.editorColumns[key]) ? this.editorColumns[key] : this.defaultFieldEditorConfig;
  }


  ngOnInit() {
    this.editorColumns = this.getColumns();
    this.rowEditorForm = this.buildFormGroup();
    this.debouncer.pipe(debounceTime(this.debounceTime))
      .subscribe((val) => this.editorChange.emit(this.rowEditorForm.getRawValue()));
    this.onChanges();
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
      group[key + this.keySuffix] = new FormControl('');
    }
    return this.formBuilder.group(group);
  }

}

