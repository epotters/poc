import {AppConfig} from "../app/app-config.service";


export const CommonEnvironment: Partial<AppConfig> = {
  timezone: 'Europe/Amsterdam',
  locale: 'NL-NL',
  applicationDisplayName: 'Proof of concept in Angular',
  applicationBasePath: '/poc/',
  realm: 'epo',
  clientId: 'poc-gui',
  defaultSnackbarDuration: 3000
};


export const POC_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

