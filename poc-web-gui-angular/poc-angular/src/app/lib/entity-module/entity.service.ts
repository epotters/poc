import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {FieldFilter} from "./domain/filter.model";
import {EntityMeta} from "./domain/entity-meta.model";
import {EntityResult} from "./domain/entity-result.model";
import {ApiService} from "./domain/api-service.model";
import {FilterBuilder} from "./common/filter-builder";


export class EntityService<T extends Identifiable> {

  filterBuilder: FilterBuilder<T>;

  constructor(
    public meta: EntityMeta<T>,
    public apiService: ApiService
  ) {
    console.debug('Start constructing entity service for type', this.meta.displayName);
    this.filterBuilder = new FilterBuilder<T>(this.meta);
  }

  public list(filters?: FieldFilter[], sortField = 'id', sortDirection = 'asc', pageNumber = 0, pageSize = 100): Observable<any> {

    console.debug('@EntityService <' + this.meta.displayName + '>.list - this.buildFilterParams(filters): ', this.filterBuilder.buildFilterParams(filters));

    let params: HttpParams = new HttpParams()
      .set('filters', this.filterBuilder.buildFilterParams(filters))
      .set('sort', sortField + ',' + sortDirection)
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    console.debug('@EntityService <' + this.meta.displayName + '>.list - HttpParams:', params);

    return this.apiService.get(this.meta.apiBase, params)
      .pipe(
        map((response: Response) => {
          let result: EntityResult<T> = {
            entities: response["content"],
            total: response['totalElements']
          };
          return result;
        })
      );
  }

  public get(id: string): Observable<any> {
    console.debug('Get', this.meta.name, 'called for id', id);
    return this.apiService.get(this.meta.apiBase + id)
      .pipe(map((response: Response) => {
        console.debug('@EntityService <' + this.meta.displayName + '>.get - Response: ', response);
        return response;
      }));
  }

  public save(entity: T): Observable<T> {
    console.debug('entity.service.save:', entity);
    if (entity.id) { // Update existing entity
      return this.apiService.post(this.meta.apiBase + entity.id, entity);
    } else { // Create new entity
      return this.apiService.put(this.meta.apiBase, entity);
    }
  }

  public delete(id: string): Observable<T> {
    console.debug('About to delete', this.meta.displayName.toLowerCase(), 'with id', id);
    return this.apiService.delete(this.meta.apiBase + id);
  }

}
