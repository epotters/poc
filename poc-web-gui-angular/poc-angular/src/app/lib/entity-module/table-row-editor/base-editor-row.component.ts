import { AfterContentInit, EventEmitter, Injector, Input, Output, Directive } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject, Subscription} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {EntityDataSource} from "../entity-data-source";
import {EntityMeta, FieldEditorConfig, Identifiable, ValidatorDescriptor} from ".";


export interface RelatedEntityEditor<S extends Identifiable> {
  active: boolean;
  dataSource: EntityDataSource<S>;
  filteredEntities?: S[];
}


@Directive()
export abstract class BaseEditorRowComponent<T extends Identifiable> implements AfterContentInit {

  @Input() readonly meta: EntityMeta<T>;
  @Input() readonly columns: string[];
  @Output() readonly editorChange: EventEmitter<any> = new EventEmitter<any>();


  editorColumns: Record<string, FieldEditorConfig>;
  rowEditorForm: FormGroup;

  defaultFieldEditorConfig: FieldEditorConfig = {type: 'text'};
  enableValidation: boolean = false;
  debouncer: Subject<string> = new Subject<string>();
  visible: boolean = true;

  subscription: Subscription;
  firstChangeEvent: boolean = true;

  autocompletes: Record<string, RelatedEntityEditor<any>> = {};
  debounceTime: number = 300;
  autoCompletePageSize: number = 20;

  constructor(
    public formBuilder: FormBuilder,
    public injector: Injector
  ) {
  }

  ngAfterContentInit() {
    this.editorColumns = this.getColumns();
    this.rowEditorForm = this.buildFormGroup();
    this.activateAutoCompletes();
    this.debouncer.pipe(debounceTime(this.debounceTime))
      .subscribe(() => {
        if (this.firstChangeEvent) {
          this.firstChangeEvent = false;
        } else {
          this.editorChange.emit(this.getOutputValue());
        }
      });
    this.onChanges();
  }

  getOutputValue() {
    return this.rowEditorForm.getRawValue();
  }

  public clear() {
    this.rowEditorForm.reset();
  }

  onChanges(): void {
    this.rowEditorForm.valueChanges.subscribe(entityData => {
      this.debouncer.next(entityData);
    });
  }

  onDestroy() {
    this.disconnectDataSurces();

  }

  private disconnectDataSurces() {
    for (let key in this.editorColumns) {
      if (this.editorColumns.hasOwnProperty(key)) {
        let editorConfig: FieldEditorConfig = this.getEditor(key);


      }
    }
  }

  buildValidators(fieldName: string): any[] {
    if (!this.enableValidation) {
      return [];
    }

    if (fieldName.indexOf('.') > -1) {
      fieldName = fieldName.split('.')[0];
    }

    const validators: any[] = [];
    const validatorDescriptors = this.meta.columnConfigs[fieldName].validators;
    if (validatorDescriptors) {
      for (let key in validatorDescriptors) {
        if (validatorDescriptors.hasOwnProperty(key)) {
          let validatorDescriptor: ValidatorDescriptor = validatorDescriptors[key];
          let validator = (validatorDescriptor.argument) ?
            Validators[validatorDescriptor.type](validatorDescriptor.argument) :
            Validators[validatorDescriptor.type];
          validators.push(validator);
        }
      }
    }
    return validators;
  }

  abstract getColumns(): Record<string, FieldEditorConfig>;

  getEditor(key: string): FieldEditorConfig {
    return (this.editorColumns[key]) ? this.editorColumns[key] : this.defaultFieldEditorConfig;
  }

  hasErrors(key: string): boolean {
    return (this.enableValidation) ? this.rowEditorForm.get(key).valid : false;
  }

  getErrorMessage(key: string): string {
    if (!this.enableValidation) {
      return '';
    }
    const errorMessages: string[] = [];
    if (this.meta.columnConfigs[key].validators && this.meta.columnConfigs[key].validators.length > 0) {
      for (let validation of this.meta.columnConfigs[key].validators) {
        if (this.hasErrorOfType(key, validation.type)) {
          errorMessages.push(validation.message);
        }
      }
    }
    return errorMessages.join('\\n');
  }

  hasErrorOfType(fieldName: string, validationType: string): boolean {
    const formControl = this.rowEditorForm.get(fieldName);
    return (formControl.hasError(validationType) && (formControl.dirty || formControl.touched));
  }


  private buildFormGroup(): FormGroup {
    let group = {};
    for (let key in this.editorColumns) {
      if (this.editorColumns.hasOwnProperty(key)) {
        group[key] = new FormControl('', this.buildValidators(key));
      }
    }
    return this.formBuilder.group(group);
  }


  private activateAutoCompletes(): void {
    for (let key in this.editorColumns) {
      if (this.editorColumns.hasOwnProperty(key)) {
        let editorConfig: FieldEditorConfig = this.getEditor(key);
        if (editorConfig.type == 'autocomplete') {
          let service = this.injector.get(editorConfig.relatedEntity.serviceName);

          this.autocompletes[key] = {
            dataSource: new EntityDataSource<T>(service.meta, service),
            active: false
          };

          this.activateAutocomplete(key, editorConfig);
        }
      }
    }
  }


  private activateAutocomplete(fieldName: string, editorConfig: FieldEditorConfig): void {

    this.subscription = this.autocompletes[fieldName].dataSource.awaitEntities().subscribe(entities => {
      console.debug('New entities received for field', fieldName);
      this.autocompletes[fieldName].filteredEntities = entities;
    });

    this.rowEditorForm
      .get(fieldName).valueChanges
      .subscribe((value) => {
        console.debug('The value of field', fieldName, 'changed to', value);
        if (value) {
          console.debug('About to load new related entities for autocomplete. Filter ', value);

          this.autocompletes[fieldName].dataSource.loadEntities(
            [{name: editorConfig.relatedEntity.displayField, rawValue: value}],
            editorConfig.relatedEntity.displayField,
            'asc',
            0,
            this.autoCompletePageSize
          );
        }
      });

    // this.rowEditorForm
    //   .get(fieldName)
    //   .valueChanges
    //   .pipe(
    //     debounceTime(300),
    //     switchMap(value => {
    //   console.debug('The value of field', fieldName, 'changed to', value);
    //   if (value) {
    //     console.debug('About to load new related entities for autocomplete. Filter ', value);
    //
    //     this.autocompletes[fieldName].dataSource.loadEntities(
    //       [{name: editorConfig.relatedEntity.displayField, rawValue: value}],
    //       editorConfig.relatedEntity.displayField,
    //       'asc',
    //       0,
    //       this.autoCompletePageSize
    //     );
    //   }
    // }));
  }



}

