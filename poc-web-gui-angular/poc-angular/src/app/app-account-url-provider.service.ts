import {Injectable} from '@angular/core';
import {AuthConfigService} from './lib/auth-lib/auth-config.service';


export interface RouteData {
  externalUrl: string;
  queryParams: QueryParams;
}

export interface QueryParams {
  [index: string]: any;

  referer: string;
  referrer_uri: string;
}

/*
// Add to a router module somewhere

{
  path: 'account',
    component: AuthLoginComponent,
  resolve: {
  url: 'accountUrlRedirectResolver'
}
}
*/

@Injectable({
  providedIn: 'root'
  // providers [{
  //   provide: 'accountUrlRedirectResolver',
  //   deps: [AuthConfigService],
  //   useFactory: (config: AuthConfigService) => {
  //     const routeData: RouteData = {
  //       externalUrl: config.accountUrl,
  //       queryParams: {
  //         referer: config.clientRoot,
  //         referrer_uri: config.clientRoot + config.applicationBasePath
  //       }
  //     };
  //     let url = routeData.externalUrl;
  //     if (routeData.queryParams) {
  //       let isFirst = true;
  //       for (const key in routeData.queryParams) {
  //         if (routeData.queryParams.hasOwnProperty(key)) {
  //           const value = routeData.queryParams[key];
  //           url += ((isFirst) ? '?' : '&') + key + '=' + value;
  //           isFirst = false;
  //         }
  //       }
  //     }
  //     window.location.href = url;
  //   }
  // }]

})
export class AccountUrlProviderService {

}
