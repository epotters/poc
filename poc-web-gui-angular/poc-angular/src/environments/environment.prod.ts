import {AppConfig} from "../app/app-config.service";

export const Environment: Partial<AppConfig> = {
  production: true,

  apiRoot: 'http://localhost:18002/poc/api',
  clientRoot: 'http://localhost:4200/poc',
  oidcProviderRoot: 'http://keycloak.localhost.lab/auth/'
};
