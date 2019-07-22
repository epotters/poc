import {Organization} from "./organization.model";
import {Person} from "./person.model";

export class Employee implements Identifiable {
  id: number;
  person: Person;
  employer: Organization;
}
