import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {FieldFilter} from "./domain/filter.model";
import {ColumnConfig, EntityMeta} from "./domain/entity-meta.model";
import {EntityResult} from "./domain/entity-result.model";
import {ApiService} from "./domain/api-service.model";
import {Moment} from "moment";


export class EntityService<T extends Identifiable> {

  dateFormat: string = 'YYYY-MM-DD';

  constructor(
    public meta: EntityMeta<T>,
    public apiService: ApiService
  ) {
    console.debug('Start constructing entity service for type ' + this.meta.displayName);
  }


  public list(filters?: FieldFilter[], sortField = 'id', sortDirection = 'asc', pageNumber = 0, pageSize = 100): Observable<any> {

    console.log('@EntityService.list - this.buildFilterParams(filters): ', this.buildFilterParams(filters));

    let params: HttpParams = new HttpParams()
      .set('filters', this.buildFilterParams(filters))
      .set('sort', sortField + ',' + sortDirection)
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    console.log('@EntityService.list - HttpParams: ', params);

    return this.apiService.get(this.meta.apiBase, params)
      .pipe(map((response: Response) => {
        console.debug(response);
        return response;
      })).pipe(
        map(res => {
          let result: EntityResult<T> = {
            entities: res["content"],
            total: res['totalElements']
          };
          return result;
        })
      );
  }


  public listEntitiesOnly(filters?: FieldFilter[], sortField = 'id', sortDirection = 'asc', pageNumber = 0, pageSize = 5): Observable<T[]> {

    let params: HttpParams = new HttpParams()
      .set('filters', this.buildFilterParams(filters))
      .set('sort', sortField + ',' + sortDirection)
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    console.log('Params: ', params);

    return this.apiService.get(this.meta.apiBase, params)
      .pipe(map((response: Response) => {
        console.debug(response);
        return response;
      })).pipe(
        map(res => {
          return res["content"];
        })
      );
  }


  get(id: string): Observable<any> {
    console.debug('Get ' + this.meta.name + ' called for id ' + id);
    return this.apiService.get(this.meta.apiBase + id)
      .pipe(map((response: Response) => {
        console.debug('Response on the next line');
        console.debug(response);
        return response;
      }));
  }


  save(entity: T): Observable<T> {

    // Update existing
    console.debug('entity.service.save:');
    console.debug(entity);

    if (entity.id) {
      return this.apiService.post(this.meta.apiBase + entity.id, entity)
        .pipe(map(data => data));

      // Create new
    } else {
      return this.apiService.put(this.meta.apiBase, entity)
        .pipe(map(data => data));
    }
  }

  destroy(id: string) {
    console.debug('About to destroy ' + this.meta.displayName.toLowerCase() + ' with id ' + id);
    return this.apiService.delete(this.meta.apiBase + id);
  }


  private buildFilterParams(filters?: FieldFilter[]): string {
    let filterParams: string = '';

    if (!filters || filters.length == 0) {
      return filterParams;
    }
    let exactMatchOperator = ':';

    for (let filter of filters) {
      let operator: string = '~';
      let value: string = filter.rawValue;
      let fieldType: string = this.getFieldType(filter.name);
      if (fieldType == 'select') {
        operator = exactMatchOperator;
      } else if (fieldType == 'date') {
        value = (<Moment>(<any>filter.rawValue)).format(this.dateFormat);
        operator = exactMatchOperator;
      } else if (filter.name === 'id') {
        operator = exactMatchOperator;
      }
      filterParams += filter.name + operator + value + ',';
    }
    filterParams = (filterParams.length > 0) ? filterParams.substr(0, filterParams.length - 1) : '';

    return filterParams;
  }

  private getFieldType(fieldName: string): string {
    let columnConfig: ColumnConfig = this.meta.columnConfigs[fieldName];

    if (!columnConfig.editor) {
      return 'text';
    }
    return (columnConfig.editor.type ? columnConfig.editor.type : columnConfig.filter.type);
  }


  listRelationsByOwner(ownerNamePlural: string, ownerId: number, relatedNamePlural: string, sortFieldName: string): Observable<T[]> {

    let params: HttpParams = new HttpParams()
      .set('sort', sortFieldName + ',' + 'asc')
      .set('page', '0')
      .set('size', '25');

    return this.apiService.get('/' + ownerNamePlural + '/' + ownerId + '/' + relatedNamePlural, params);
  }


}
