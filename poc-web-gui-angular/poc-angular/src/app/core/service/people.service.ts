import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {FilterSet} from "../../common/filter.model";
import {ApiService} from './api.service';
import {Person} from '../domain';


@Injectable()
export class PeopleService {
  private peopleBase: string = '/people/';

  constructor(private apiService: ApiService) {
  }


  // list(filterSet: FilterSet): Observable<{ people: Person[], peopleCount: number }> {
  list(filterSet: FilterSet, sortField, sortDirection = 'asc', pageNumber = 0, pageSize = 100): Observable<any> {

    // Build filter params
    let filterParams: string = '';
    for (let filter of filterSet.filters) {
      filterParams += filter.name + '~' + filter.value + ',';
    }

    let params: HttpParams = new HttpParams()
      .set('sort', sortField + ',' + sortDirection)
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    if (filterParams.length > 0) {
      params.set('filters', filterParams.substr(0, filterParams.length - 1));
    }

    return this.apiService.get(this.peopleBase, params)
      .pipe(map((response: Response) => {
        console.debug(response);
        return response;
      })).pipe(
        // { people: res["content"], peopleCount: res["total"] }
        map(res => res["content"])
      );
  }

  get(id: string): Observable<any> {
    console.debug('Get person called for id ' + id);
    return this.apiService.get(this.peopleBase + id)
      .pipe(map((response: Response) => {
        console.debug('Response on the next line');
        console.debug(response);
        return response;
      }))
  }

  destroy(id: string) {
    return this.apiService.delete(this.peopleBase + id);
  }

  save(person: Person): Observable<Person> {

    // Update existing

    console.debug('people.service.save:');
    person.household = null;
    console.debug(person);

    if (person.id) {
      return this.apiService.post(this.peopleBase + person.id, person)
        .pipe(map(data => data.person));

      // Create new
    } else {
      return this.apiService.put(this.peopleBase, person)
        .pipe(map(data => data.person));
    }
  }

}
