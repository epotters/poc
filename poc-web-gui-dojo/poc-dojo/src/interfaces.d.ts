import {GridState} from "@dojo/widgets/grid/interfaces";

import Home from "./widgets/Home";
import CurrentUser from "./widgets/CurrentUser";
import PeopleList from "./widgets/PeopleList";
import PersonEditor from "./widgets/PersonEditor";


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


// export interface PeopleList extends Grid<Person>, ResourceBased {
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
  logout: CurrentUser;
  feedback: Message;
  errors: Errors;
  peopleList: PeopleList;
  peopleGridState: GridState<Person>;
  personEditor: PersonEditor;
}
