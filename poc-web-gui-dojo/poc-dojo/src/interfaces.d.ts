import PeopleList from "./widgets/PeopleList";
import PersonEditor from "./widgets/PersonEditor";
import Home from "./widgets/Home";
import CurrentUser from "./widgets/CurrentUser";

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

export interface Logout extends ResourceBased {
}


export interface Routing {
  outlet: string;
  params: { [index: string]: string };
}


export interface Errors {
  [index: string]: string[];
}


export interface State {
  home: Home;
  user: UserSession;
  routing: Routing;
  login: Login;
  logout: CurrentUser;
  errors: Errors;
  peopleList: PeopleList;
  personEditor: PersonEditor;
}
