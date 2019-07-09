import {Injectable} from "@angular/core";
import {EntityMeta} from "../lib/entity-module";
import {Person} from "../core/domain";


@Injectable({
  providedIn: 'root',
})
export class PersonMeta implements EntityMeta<Person> {

  // General
  name = 'person';
  namePlural = 'people';
  displayName = 'Person';
  displayNamePlural = 'People';

  // API
  apiBase = '/people/';

  // List
  defaultPageSize = 150;
  defaultSortField = 'lastName';
  defaultSortDirection = 'asc';
  displayedColumns = ['id', 'firstName', 'prefix', 'lastName', 'gender', 'birthDate', 'birthPlace'];
  
  
  // Editor
  validationMessages = {
    'firstName': [
      {type: 'required', message: 'First name is required'},
      {type: 'pattern', message: 'First name can only contain characters, dashes and spaces'}
    ],
    'lastName': [
      {type: 'required', message: 'Last name is required'},
      {type: 'pattern', message: 'Last name can only contain characters, dashes and spaces'},
      {type: 'maxlength', message: 'Last name must not be longer than 60 characters'}
    ]
  };
}

