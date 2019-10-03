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
    console.debug('Start constructing entity service for type', this.meta.displayName);
  }


  public list(filters?: FieldFilter[], sortField = 'id', sortDirection = 'asc', pageNumber = 0, pageSize = 100): Observable<any> {

    console.debug('@EntityService <', this.meta.displayName, '>.list - this.buildFilterParams(filters): ', this.buildFilterParams(filters));

    let params: HttpParams = new HttpParams()
      .set('filters', this.buildFilterParams(filters))
      .set('sort', sortField + ',' + sortDirection)
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    console.debug('@EntityService <', this.meta.displayName, '>.list - HttpParams:', params);

    return this.apiService.get(this.meta.apiBase, params)
      .pipe(
        map((response: Response) => {
          console.debug(response);
          let result: EntityResult<T> = {
            entities: response["content"],
            total: response['totalElements']
          };
          return result;
        })
      );
  }


  public listEntitiesOnly(filters?: FieldFilter[], sortField = 'id', sortDirection = 'asc', pageNumber = 0, pageSize = 5): Observable<T[]> {

    return this.list(filters, sortField, sortDirection, pageNumber, pageSize)
      .pipe(
        map((response) => {
          return response.entities;
        }));

    //
    // let params: HttpParams = new HttpParams()
    //   .set('filters', this.buildFilterParams(filters))
    //   .set('sort', sortField + ',' + sortDirection)
    //   .set('page', pageNumber.toString())
    //   .set('size', pageSize.toString());
    //
    // console.debug('Params for', this.meta.displayName.toLowerCase(), 'request:', params);
    //
    // return this.apiService.get(this.meta.apiBase, params)
    //   .pipe(
    //     map((response: Response) => {
    //       console.debug(response);
    //       return response;
    //     })).pipe(
    //     map(res => {
    //       return res["content"];
    //     })
    //   );
  }


  get(id: string): Observable<any> {
    console.debug('Get', this.meta.name, 'called for id', id);
    return this.apiService.get(this.meta.apiBase + id)
      .pipe(map((response: Response) => {
        console.debug('@EntityService <', this.meta.displayName, '>.get - Response: ', response);
        return response;
      }));
  }


  save(entity: T): Observable<T> {

    // Update existing
    console.debug('entity.service.save:', entity);

    if (entity.id) {
      return this.apiService.post(this.meta.apiBase + entity.id, entity)
        .pipe(map(data => data));

      // Create new
    } else {
      return this.apiService.put(this.meta.apiBase, entity)
        .pipe(map(data => data));
    }
  }

  destroy(id: string): Observable<T> {
    console.debug('About to destroy', this.meta.displayName.toLowerCase(), 'with id', id);
    return this.apiService.delete(this.meta.apiBase + id);
  }


  private buildFilterParams(filters?: FieldFilter[]): string {
    let filterParams: string[] = [];
    if (!filters || filters.length == 0) {
      return '';
    }
    const exactMatchOperator = ':';
    const likeOperator = '~';
    for (let filter of filters) {
      let operator: string = likeOperator;
      let value: string = filter.rawValue;
      let editorType: string = this.getEditorType(filter.name);
      if (editorType == 'select') {
        operator = exactMatchOperator;
      } else if (editorType == 'date') {
        operator = exactMatchOperator;
        value = (<Moment>(<any>filter.rawValue)).format(this.dateFormat);
      } else if (editorType === 'autocomplete') {
        operator = exactMatchOperator;
      } else if (filter.name === 'id' || filter.name.endsWith('.id')) {
        operator = exactMatchOperator;
      }
      filterParams.push(filter.name + operator + value);
    }
    return filterParams.join(',');
  }

  private getEditorType(fieldName: string): string {
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
    return (columnConfig.editor.type ? columnConfig.editor.type : columnConfig.filter.type);
  }


  // listRelationsByOwner(ownerNamePlural: string, ownerId: number, relatedNamePlural: string, sortFieldName: string): Observable<T[]> {
  //
  //   let params: HttpParams = new HttpParams()
  //     .set('sort', sortFieldName + ',' + 'asc')
  //     .set('page', '0')
  //     .set('size', '25');
  //
  //   return this.apiService.get('/' + ownerNamePlural + '/' + ownerId + '/' + relatedNamePlural, params);
  // }

}
