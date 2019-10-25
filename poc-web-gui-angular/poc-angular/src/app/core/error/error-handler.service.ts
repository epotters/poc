import {ErrorHandler, Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {PocError} from "./error.interceptor";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  errorSubject: Subject<PocError> = new Subject<PocError>();

  constructor() {
  }

  handleError(error: any) {
    console.debug('PocErrorHandler');
    this.errorSubject.next({code: 'GENERAL_ERROR', message: error.message});
    console.error(error);
  }

  awaitErrors(): Observable<PocError> {
    return this.errorSubject.asObservable();
  }
}
