import {Organization} from "./organization.model";
import {Person} from "./person.model";


export class Employment implements Identifiable {
  id: number;
  startDate: string;
  endDate: string;
  employee: Person;
  employer: Organization;
  description: string;
}
