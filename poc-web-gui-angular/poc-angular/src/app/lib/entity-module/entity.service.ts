import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {FieldFilter} from "./domain/filter.model";
import {EntityMeta} from "./domain/entity-meta.model";
import {EntityResult} from "./domain/entity-result.model";
import {ApiService} from "./domain/api-service.model";


export class EntityService<T extends Identifiable> {

  constructor(
    public meta: EntityMeta<T>,
    public apiService: ApiService
  ) {
    console.debug('Start constructing entity service for type ' + this.meta.displayName);
  }


  public list(filters?: FieldFilter[], sortField = 'id', sortDirection = 'asc', pageNumber = 0, pageSize = 100): Observable<any> {

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

          let result: EntityResult<T> = {
            entities: res["content"],
            total: res['totalElements']
          };
          return result;
        })
      );
  }


  public listEntitiesOnly(filters?: FieldFilter[], sortField = 'id', sortDirection = 'asc', pageNumber = 0, pageSize = 5): Observable<any> {

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
    let exactMatchOperator = ':';
    if (filters) {
      for (let filter of filters) {
        let operator: string = '~';
        if (this.meta.filteredColumns[filter.name].type == 'select') {
          operator = exactMatchOperator;
        } else if (this.meta.filteredColumns[filter.name].type == 'date') {
          operator = exactMatchOperator;
        } else if (filter.name === 'id') {
          operator = exactMatchOperator;
        }
        filterParams += filter.name + operator + filter.rawValue + ',';
      }
      filterParams = (filterParams.length > 0) ? filterParams.substr(0, filterParams.length - 1) : '';
    }
    return filterParams;
  }


  listRelationsByOwner(ownerNamePlural: string, ownerId: number): Observable<T[]> {
    return this.apiService.get('/' + ownerNamePlural + '/' + ownerId + '/' + this.meta.namePlural);
  }


}
