import {ErrorHandler, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {Subject} from 'rxjs';
import {ConfigService} from '../../app-config.service';
import {PocError} from './errors';

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {

  errorSubject: Subject<PocError> = new Subject<PocError>();

  constructor(
    public config: ConfigService,
    public logger: NGXLogger) {
  }

  handleError(error: any) {
    this.logger.debug('Inside ErrorHandlerService.handleError');
    this.errorSubject.next({code: 'GENERAL_ERROR', message: error.message});
    this.logger.error(error);
  }
}
