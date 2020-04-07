import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NGXLogger} from 'ngx-logger';


@Component({
  selector: 'global-error-handler',
  template: '...'
})
export class ErrorHandlerComponent {

  constructor(
    public snackbar: MatSnackBar, public logger: NGXLogger) {
    this.logger.debug('Constructing the ErrorHandlerComponent');
  }

  showError(msg: string): void {
    this.snackbar.open(msg, undefined, {
      duration: 3000
    });
  }

}
