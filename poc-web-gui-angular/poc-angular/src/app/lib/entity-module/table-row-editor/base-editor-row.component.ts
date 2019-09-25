import {AfterContentInit, EventEmitter, Injector, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {EntityDataSource} from "../entity-data-source";
import {EntityMeta, FieldEditorConfig} from "../domain/entity-meta.model";


export abstract class BaseEditorRowComponent<T extends Identifiable> implements AfterContentInit {

  @Output() readonly editorChange: EventEmitter<any> = new EventEmitter<any>();

  editorColumns: Record<string, FieldEditorConfig>;
  rowEditorForm: FormGroup;

  dataSources: Record<string, any> = {};
  keySuffix: string;
  debounceTime: number = 300;
  autoCompletePageSize: number = 20;
  defaultFieldEditorConfig: FieldEditorConfig = {type: 'text'};

  debouncer: Subject<string> = new Subject<string>();

  visible: boolean = true;

  constructor(
    public meta: EntityMeta<T>,
    public formBuilder: FormBuilder,
    public injector: Injector
  ) {
    console.debug('Constructing BaseEditorRowComponent (keySuffix: ' + this.keySuffix + ')');
  }

  ngAfterContentInit() {
    console.debug('ngAfterViewInit called for BaseEditorRowComponent');
    this.editorColumns = this.getColumns();
    this.prepareAutoCompletes();
    this.rowEditorForm = this.buildFormGroup();
    this.activateAutoCompletes();
    this.debouncer.pipe(debounceTime(this.debounceTime))
      .subscribe((val) => this.editorChange.emit(this.getOutputValue()));
    this.onChanges();
  }


  getOutputValue() {
    return this.rowEditorForm.getRawValue();
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
            console.debug(service);
            this.dataSources[editorConfig.relatedEntity.name] = new EntityDataSource<T>(service.meta, service);
          }
        }
      }
    }
    console.debug('this.dataSources');
    console.debug(this.dataSources);
  }


  private activateAutoCompletes(): void {
    for (let key in this.editorColumns) {
      if (this.editorColumns.hasOwnProperty(key)) {
        let editorConfig: FieldEditorConfig = this.getEditor(key);
        if (editorConfig.type == 'autocomplete') {
          this.activateAutocomplete(key, editorConfig);
        }
      }
    }
  }

  private activateAutocomplete(fieldName: string, editorConfig: FieldEditorConfig): void {
    this.rowEditorForm
      .get(fieldName)
      .valueChanges
      .subscribe((value) => {
        console.debug('About to load new related entities for autocomplete. Filter ' + value);
        this.dataSources[editorConfig.relatedEntity.name].loadEntities(
          [{name: editorConfig.relatedEntity.displayField, rawValue: value}],
          editorConfig.relatedEntity.displayField,
          'asc',
          0,
          this.autoCompletePageSize
        );
      });
  }

}

