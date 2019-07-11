import {EntityService} from "../lib/entity-module";
import {PocApiService} from "../core/service";
import {Person} from "../core/domain";
import {personMeta} from "./person-meta";

export class PersonService extends EntityService<Person> {

  constructor(
    public apiService: PocApiService) {
    super(personMeta, apiService);
  }
}
