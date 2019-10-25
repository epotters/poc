// ERROR HANDLER MODULE
import {ErrorHandler, ModuleWithProviders, NgModule} from '@angular/core';
import {A11yModule} from '@angular/cdk/a11y';
import {CommonModule} from "@angular/common";
import {FullscreenOverlayContainer, OverlayContainer, OverlayModule} from '@angular/cdk/overlay';
import {ErrorHandlerService} from './error-handler.service';
import {ErrorHandlerComponent} from './error-handler.component';


// Source: https://www.freecodecamp.org/news/global-error-handling-in-angular-with-the-help-of-the-cdk/
@NgModule({
  declarations: [ErrorHandlerComponent],
  imports: [CommonModule, OverlayModule, A11yModule],
  entryComponents: [ErrorHandlerComponent]
})
export class ErrorHandlerModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ErrorHandlerModule,
      providers: [
        {provide: ErrorHandler, useClass: ErrorHandlerService},
        {provide: OverlayContainer, useClass: FullscreenOverlayContainer},
      ]
    };
  }
}
