import {AfterContentInit, EventEmitter, Injector, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {EntityDataSource} from "../entity-data-source";
import {EntityMeta, FieldEditorConfig} from "../domain/entity-meta.model";


export abstract class BaseEditorRowComponent<T extends Identifiable> implements OnInit, OnChanges, AfterContentInit {

  @Output() readonly editorChange: EventEmitter<any> = new EventEmitter<any>();

  editorColumns: Record<string, FieldEditorConfig>;
  dataSources: Record<string, any> = {};
  keySuffix: string;
  debounceTime: number = 300;

  defaultFieldEditorConfig: FieldEditorConfig = {type: 'text'};

  debouncer: Subject<string> = new Subject<string>();
  rowEditorForm: FormGroup;

  visible: boolean = true;

  constructor(
    public meta: EntityMeta<T>,
    public formBuilder: FormBuilder,
    public injector: Injector
  ) {
    console.debug('Constructing BaseEditorRowComponent (keySuffix: ' + this.keySuffix + ')');
  }


  ngOnChanges(changes: SimpleChanges) {
    console.debug('ngOnChanges called for BaseEditorRowComponent');
    console.debug(changes);
  }


  ngOnInit() {
    console.debug('ngOnInit called for BaseEditorRowComponent');
  }

  ngAfterContentInit() {
    console.debug('ngAfterViewInit called for BaseEditorRowComponent');
    this.editorColumns = this.getColumns();
    this.prepareAutoCompletes();
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
    this.rowEditorForm.valueChanges.subscribe(entityData => {
      console.debug('Editor form changed');
      console.debug(entityData);
      this.debouncer.next(entityData);
    });
  }


  private buildFormGroup(): FormGroup {
    let group = {};
    for (let key in this.editorColumns) {
      group[key + this.keySuffix] = new FormControl('');
    }
    return this.formBuilder.group(group);
  }


  abstract getColumns(): Record<string, FieldEditorConfig>;


  getEditor(key: string): FieldEditorConfig {
    return (this.editorColumns[key]) ? this.editorColumns[key] : this.defaultFieldEditorConfig;
  }

  private prepareAutoCompletes(): void {
    for (let key in this.editorColumns) {
      let editorConfig: FieldEditorConfig = this.getEditor(key);
      if (editorConfig.type == 'autocomplete') {
        if (editorConfig.relatedEntity) {
          if (!this.dataSources[editorConfig.relatedEntity.name]) {
            let service = this.injector.get(editorConfig.relatedEntity.serviceName);
            this.dataSources[editorConfig.relatedEntity.name] = new EntityDataSource<T>(service.meta, service);
          }
        }
      }
    }
    console.debug('this.dataSources');
    console.debug(this.dataSources);
  }

}

