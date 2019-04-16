import {Person, UserProfile} from "../interfaces";
import {OutletContext} from '@dojo/framework/routing/interfaces';


export interface PersonIdPayload {
  personId: number;
}

export interface PersonPayload {
  person: Person;
}

export interface PartialPersonPayload {
  person: Partial<Person>;
}


/*****/

export interface EmailPayload {
  email: string;
}

export interface UsernamePayload {
  username: string;
}

export interface PasswordPayload {
  password: string;
}


/*****/

export interface SetSessionPayload {
  session: UserProfile;
}

export interface ChangeRoutePayload {
  outlet: string;
  context: OutletContext;
}