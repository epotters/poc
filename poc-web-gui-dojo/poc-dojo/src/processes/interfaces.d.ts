import {Organization, Person, UserSession} from "../interfaces";
import {OutletContext} from '@dojo/framework/routing/interfaces';
import {FetcherOptions} from "@dojo/widgets/grid/interfaces";


export interface PersonIdPayload {
  personId: number;
}

export interface PartialPersonPayload {
  person: Partial<Person>;
}

export interface OrganizationIdPayload {
  organizationId: number;
}

export interface PartialOrganizationPayload {
  organization: Partial<Organization>;
}


export interface PageSortFilterPayload {
  page: number;
  pageSize: number;
  options: FetcherOptions;
}


/*****/

export interface UsernamePayload {
  username: string;
}

export interface PasswordPayload {
  password: string;
}


/*****/

export interface SetSessionPayload {
  session: UserSession;
}

export interface RouteIdPayload {
  routeId: string;
}

export interface ChangeRoutePayload {
  outlet: string;
  context: OutletContext;
}
