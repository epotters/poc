import {Injectable} from '@angular/core';
import {UserManagerSettings} from 'oidc-client';


export interface AuthConfig {
  userManagerSettings: UserManagerSettings;
}

/*
This service should be replaced by an application global ConfigService that implements the AuthConfig interface
 */

@Injectable({
  providedIn: 'root'
})
export class AuthConfigService implements AuthConfig {

  userManagerSettings!: UserManagerSettings;

  constructor() {
    console.info('Constructing AuthConfigService');
  }
}

