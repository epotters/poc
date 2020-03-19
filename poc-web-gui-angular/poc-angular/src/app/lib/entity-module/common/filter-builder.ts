import {FieldFilter} from "../domain/filter.model";
import {ColumnConfig, EntityMeta, Identifiable} from "..";
import {DateFilterHelper, SearchDate} from "./date-filter-helper";
import {FilterConstants} from "./filter-contants";

export class FilterBuilder<T extends Identifiable> {

  constructor(public meta: EntityMeta<T>) {
  }

  public buildFilterParams(filters?: FieldFilter[]): string {

    let filterParams: string[] = [];
    if (!filters || filters.length == 0) {
      return '';
    }

    for (let filter of filters) {
      let operator: string = FilterConstants.likeOperator;
      let value: string = filter.rawValue;
      let editorType: string | null = this.getEditorType(filter.name);
      if (editorType == 'select') {
        operator = FilterConstants.exactMatchOperator;
      } else if (editorType == 'date') {
        operator = FilterConstants.exactMatchOperator;
        const dateFilterHelper = new DateFilterHelper();
        const dateSearch: SearchDate = dateFilterHelper.processDateTerm(filter.rawValue);
        value = (dateSearch.valid && dateSearch.normalizedTerm) ? dateSearch.normalizedTerm : '';
      } else if (filter.name === 'id' || filter.name.endsWith('.id')) {
        operator = FilterConstants.exactMatchOperator;
      }
      filterParams.push(filter.name + operator + value);
    }
    return filterParams.join(',');
  }

  private getEditorType(fieldName: string): string | null {
    let columnConfig: ColumnConfig = this.meta.columnConfigs[fieldName];
    if (fieldName.includes('.')) {
      console.debug(`Processing nested field ${fieldName} from type ${this.meta.displayName}`);
      let fieldNameParts: string[] = fieldName.split('.');
      if (fieldNameParts.length != 2) {
        console.warn(`Only one level of nesting supported. Skipping ${fieldName} from ${this.meta.displayName}`);
        return null;
      }
      columnConfig = this.meta.columnConfigs[fieldNameParts[0]];
    }

    if (!columnConfig.editor) {
      return 'text';
    }
    return (columnConfig.editor.type ? columnConfig.editor.type : (!!columnConfig.filter) ? columnConfig.filter.type : null);
  }
}
