import {Person} from "../interfaces";

export interface PersonIdPayload {
  personId: number;
}


export interface PersonPayload {
  person: Person;
}

export interface PartialPersonPayload {
  person: Partial<Person>;
}
