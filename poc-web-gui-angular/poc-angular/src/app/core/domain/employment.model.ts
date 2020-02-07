import {Organization} from "./organization.model";
import {Person} from "./person.model";
import {Identifiable} from "../../lib/entity-module";


export class Employment implements Identifiable {
  id: number;
  startDate: string;
  endDate: string;
  employee: Person;
  employer: Organization;
  description: string;
}
