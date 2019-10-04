import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler{
  constructor() {}

  handleError(error: any) {
    console.debug('PocErrorHandler');
    console.error(error);
  }
}
