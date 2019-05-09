import {GridState} from "@dojo/widgets/grid/interfaces";


export type WithTarget<T extends Event = Event, E extends HTMLElement = HTMLInputElement> = T & { target: E };


export interface ResourceBased {
  loading: boolean;
  loaded: boolean;
}


export interface Person {
  id: number;
  firstName: string;
  prefix: string;
  lastName: string;
  gender: string;
  birthDate: string;
  birthPlace: string;
}


export interface Household {
  members: Person[];
}


export interface PeopleList extends ResourceBased {
}


export interface PersonEditor extends ResourceBased {
  person: Person;
}


export interface Organization {
  id: number;
  name: string;
}

export interface OrganizationsList extends ResourceBased {
}

export interface OrganizationEditor extends ResourceBased {
  organization: Organization;
}


export interface Home {
  welcomeMessage: string;
}


export interface User {
  username: string;
  displayName: string;
  roles: string[];
  mail: string;
}


export interface UserSession extends User, ResourceBased {
  token: string;
  refreshToken: string;
  startTime: Date;
  endTime: Date;
}


export interface Login extends ResourceBased {
  username: string;
  password: string;
  failed: boolean;
}

export interface Routing {
  outlet: string;
  params: { [index: string]: string };
}


export interface Message {
  text: string;
}


export interface Errors {
  [index: string]: string[];
}


export interface PocState {
  home: Home;
  routing: Routing;
  user: UserSession;
  login: Login;
  feedback: Message;
  errors: Errors;

  peopleList: PeopleList;
  peopleGridState: GridState<Person>;
  personEditor: PersonEditor;

  organizationsList: OrganizationsList;
  organizationsGridState: GridState<Organization>;
  organizationEditor: OrganizationEditor;
}
