export type WithTarget<T extends Event = Event, E extends HTMLElement = HTMLInputElement> = T & { target: E };

export interface Domain {
}


export interface ResourceBased {
  loading: boolean;
  loaded: boolean;
}


export interface Person extends ResourceBased {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  birthPlace: string;
  household: Household;
}

export interface Household extends ResourceBased {
  members: Person[];
}


export interface User {
  id: number;
  name: string;
  displayName: string;
  roles: string[];
}


export interface UserProfile extends User, ResourceBased {
  email: string;
  token: string;
}


export interface Settings extends UserProfile {
  password: string;
}


export interface Routing {
  outlet: string;
  params: { [index: string]: string };
}


export interface Login extends ResourceBased {
  email: string;
  password: string;
  failed: boolean;
}


export interface RegistrationRequest extends ResourceBased {
  username: string;
  password: string;
  email: string;
  failed: boolean;
}


export interface State {
  settings: Settings;
  user: UserProfile;
  routing: Routing;
  login: Login;
  register: RegistrationRequest;
}

