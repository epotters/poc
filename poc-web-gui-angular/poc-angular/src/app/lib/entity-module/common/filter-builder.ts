import {FieldFilter} from "../domain/filter.model";
import {Moment} from "moment";
import {EntityLibConfig} from "./entity-lib-config";
import {ColumnConfig, EntityMeta, Identifiable} from "..";

export class FilterBuilder<T extends Identifiable> {

  exactMatchOperator = ':';
  likeOperator = '~';

  constructor(public meta: EntityMeta<T>) {
  }

  public buildFilterParams(filters?: FieldFilter[]): string {

    let filterParams: string[] = [];
    if (!filters || filters.length == 0) {
      return '';
    }

    for (let filter of filters) {
      let operator: string = this.likeOperator;
      let value: string = filter.rawValue;
      let editorType: string | null = this.getEditorType(filter.name);
      if (editorType == 'select') {
        operator = this.exactMatchOperator;
      } else if (editorType == 'date') {
        operator = this.exactMatchOperator;
        value = (<Moment>(<any>filter.rawValue)).format(EntityLibConfig.dateFormat);
      } else if (filter.name === 'id' || filter.name.endsWith('.id')) {
        operator = this.exactMatchOperator;
      }
      filterParams.push(filter.name + operator + value);
    }
    return filterParams.join(',');
  }

  private getEditorType(fieldName: string): string | null {
    let columnConfig: ColumnConfig = this.meta.columnConfigs[fieldName];
    if (fieldName.includes('.')) {
      console.debug('Processing nested field', fieldName, this.meta.displayName);

      let fieldNameParts: string[] = fieldName.split('.');
      if (fieldNameParts.length != 2) {
        console.warn(this.meta.displayName, 'Only one level of nesting supported', fieldName);
        return null;
      }
      columnConfig = this.meta.columnConfigs[fieldNameParts[0]];
      console.debug('fieldName', this.meta.columnConfigs, fieldNameParts[0], columnConfig);
    }

    if (!columnConfig.editor) {
      return 'text';
    }
    return (columnConfig.editor.type ? columnConfig.editor.type : (!!columnConfig.filter) ? columnConfig.filter.type : null);
  }
}
