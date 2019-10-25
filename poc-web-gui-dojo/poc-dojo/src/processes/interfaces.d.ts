import {ConfirmationRequest, LoginRequest, Organization, Person, Session} from "../interfaces";
import {OutletContext} from '@dojo/framework/routing/interfaces';
import {FetcherOptions} from "@dojo/widgets/grid/interfaces";


export interface PersonIdPayload {
  personId: number;
}

export interface PartialPersonPayload {
  person: Partial<Person>;
}

export interface ConfirmedPersonActionPayload extends PersonIdPayload {
  confirmationRequest: ConfirmationRequest,
  options: FetcherOptions
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

export interface ConfirmationPayload {
  confirmationRequest: ConfirmationRequest
}


/*****/

export interface PartialLoginRequestPayload {
  loginRequest: Partial<LoginRequest>;
}

/*****/

export interface SetSessionPayload {
  session: Session;
}

export interface RouteIdPayload {
  routeId: string;
}

export interface ChangeRoutePayload {
  outlet: string;
  context: OutletContext;
}
