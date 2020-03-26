import {Component} from '@angular/core';
import {EntityLibConfig} from '../../lib/entity-module/common/entity-lib-config';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'global-error-handler',
  template: '...'
})
export class ErrorHandlerComponent {

  constructor(
    public snackbar: MatSnackBar) {
    console.debug('Constructing the ErrorHandlerComponent');
  }

  showError(msg: string): void {
    this.snackbar.open(msg, undefined, {
      duration: EntityLibConfig.defaultSnackbarDuration
    });
  }

}
