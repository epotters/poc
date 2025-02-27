import {ErrorHandler, Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {PocError} from "./error.interceptor";
import {ConfigService} from "../../app-config.service";

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {

  errorSubject: Subject<PocError> = new Subject<PocError>();

  constructor(public config: ConfigService) {
  }

  handleError(error: any) {
    console.debug('Inside ErrorHandlerService.handleError');

    console.debug('config:', this.config);

    // Try out
    // this.createInjector(error);
    /////

    this.errorSubject.next({code: 'GENERAL_ERROR', message: error.message});
    console.error(error);
  }

  awaitErrors(): Observable<PocError> {
    return this.errorSubject.asObservable();
  }


  /////


  // private createInjector(error: any): void {
  //
  //   const injectorTokens = new WeakMap<any, any>([
  //     [ERROR_INJECTOR_TOKEN, error]
  //   ]);
  //
  //   // return new PortalInjector(this.injector, injectorTokens);
  // }
}
