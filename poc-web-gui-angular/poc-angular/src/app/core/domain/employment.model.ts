import {Organization} from "./organization.model";
import {Person} from "./person.model";


export class Employment implements Identifiable {
  id: number;
  employee: Person;
  employer: Organization;
}
