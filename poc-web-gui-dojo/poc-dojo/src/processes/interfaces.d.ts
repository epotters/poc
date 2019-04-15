import {Person} from '../interfaces';

export interface PersonIdPayload {
  id: number;
}

export interface NewHouseholdPayload {
  member: Person;
}

export interface AddHouseholdPayload extends NewHouseholdPayload {
}

export interface DeleteHouseholdPayload {
  id: number;
}