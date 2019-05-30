import {GridState} from "@dojo/widgets/grid/interfaces";
import {ConfirmationPayload} from "./processes/interfaces";


export type WithTarget<T extends Event = Event, E extends HTMLElement = HTMLInputElement> = T & { target: E };


export interface ResourceBased {
  loading: boolean;
  loaded: boolean;
}


// Domain

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
  personForBatchUpdate: Partial<Person>;
}


export interface PersonEditor extends ResourceBased {
  person: Person;

  hasChanges: boolean;

  canNavigate: boolean;
  previousPerson: Person;
  nextPerson: Person;
}


export interface Organization {
  id: number;
  displyName: string;
}


// Base setup
export interface Home {
  welcomeMessage: string;
}

export interface Routing {
  outlet: string;
  params: { [index: string]: string };
}


// Login
export interface User extends ResourceBased {
  username: string;
  displayName: string;
  roles: string[];
  mail: string;
}


export interface Session {
  username: string;
  token: string;
  startTime: Date;
  endTime: Date;
  refreshToken: string;
}


export interface LoginRequest extends ResourceBased {
  username: string;
  password: string;
  failed: boolean;
}


// Conversation
export interface Message {
  title?: string;
  text: string;
}

export interface ConfirmationRequest {
  action: string;
  text: string;
  confirming: boolean;
  confirmed: boolean;
  confirm: (opts: ConfirmationPayload) => void;
  cancel: (opts: ConfirmationPayload) => void;
}


export interface Errors {
  [index: string]: string[];
}


// Main Application State
export interface PocState {
  home: Home;
  routing: Routing;

  user: User;
  session: Session;
  loginRequest: LoginRequest;

  feedback: Message;
  confirmationRequest: ConfirmationRequest;
  errors: Errors;

  peopleList: PeopleList;
  peopleGridState: GridState<Person>;
  personEditor: PersonEditor;

}
