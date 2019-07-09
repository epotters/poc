import {EntityService} from "../lib/entity-module";
import {ApiService} from "../core/service";
import {Person} from "../core/domain";
import {PersonMeta} from "./person-meta";

export class PersonService extends EntityService<Person> {

  constructor(
    public meta: PersonMeta,
    public apiService: ApiService) {
    super(meta, apiService);
  }
}
