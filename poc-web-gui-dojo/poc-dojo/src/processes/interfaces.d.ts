import {Person, UserProfile} from "../interfaces";
import {OutletContext} from '@dojo/framework/routing/interfaces';
import {buildQueryString} from "./utils";
import {FetcherOptions} from "@dojo/widgets/grid/interfaces";


export interface PersonIdPayload {
  personId: number;
}

export interface PartialPersonPayload {
  person: Partial<Person>;
}


export interface PageSortFilterPayload {
  page: number;
  pageSize: number;
  options: FetcherOptions;
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