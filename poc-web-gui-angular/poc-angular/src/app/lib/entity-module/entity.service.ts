import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {FilterSet} from "./domain/filter.model";
import {EntityMeta} from "./domain/entity-meta.model";
import {EntityResult} from "./domain/entity-result.model";
import {ApiService} from "./domain/api-service.model";


export class EntityService<T extends Identifiable> {

  constructor(
    public meta: EntityMeta<T>,
    public apiService: ApiService) {
    console.debug('Start constructing entity service for type ' + this.meta.displayName);
  }


  public list(filterSet?: FilterSet, sortField = 'id', sortDirection = 'asc', pageNumber = 0, pageSize = 100): Observable<any> {

    // Build filter params
    let filterParams: string = '';
    if (filterSet) {
      for (let filter of filterSet.filters) {
        filterParams += filter.name + '~' + filter.value + ',';
      }
      filterParams = (filterParams.length > 0) ? filterParams.substr(0, filterParams.length - 1) : '';
    }
    let params: HttpParams = new HttpParams()
      .set('filters', filterParams)
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



  public listEntitiesOnly(filterSet?: FilterSet, sortField = 'id', sortDirection = 'asc', pageNumber = 0, pageSize = 5): Observable<any> {

    // Build filter params
    let filterParams: string = '';
    if (filterSet) {
      for (let filter of filterSet.filters) {
        filterParams += filter.name + '~' + filter.value + ',';
      }
      filterParams = (filterParams.length > 0) ? filterParams.substr(0, filterParams.length - 1) : '';
    }
    let params: HttpParams = new HttpParams()
      .set('filters', filterParams)
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
        .pipe(map(data => data.entity));

      // Create new
    } else {
      return this.apiService.put(this.meta.apiBase, entity)
        .pipe(map(data => data.entity));
    }
  }

  destroy(id: string) {
    console.debug('About to destroy ' + this.meta.displayName.toLowerCase() + ' with id ' + id);
    return this.apiService.delete(this.meta.apiBase + id);
  }


}
