import {Component} from "@angular/core";
import {EntityLibConfig} from "../../lib/entity-module/common/entity-lib-config";
import {MatSnackBar} from "@angular/material/snack-bar";

// export const ERROR_INJECTOR_TOKEN: InjectionToken<any> = new InjectionToken('ErrorInjectorToken');


@Component({
  selector: 'global-error-handler',
  template: '...'
})
export class ErrorHandlerComponent {

  constructor(
    // @Inject(ERROR_INJECTOR_TOKEN) public error,
    public snackbar: MatSnackBar) {

    console.debug('Constructing the ErrorHandlerComponent');
  }

  showError(msg: string): void {
    this.snackbar.open(msg, undefined, {
      duration: EntityLibConfig.defaultSnackbarDuration
    });
  }

}
