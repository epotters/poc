// ERROR HANDLER MODULE
import {ErrorHandler, ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ErrorService} from './error.service';
import {ErrorHandlerComponent} from './error-handler.component';


// Source: https://www.freecodecamp.org/news/global-error-handling-in-angular-with-the-help-of-the-cdk/
@NgModule({
  declarations: [ErrorHandlerComponent],
  imports: [
    CommonModule
    // OverlayModule, A11yModule
  ],
  exports: [
    ErrorHandlerComponent
  ],
  entryComponents: [ErrorHandlerComponent]
})
export class ErrorModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ErrorModule,
      providers: [
        {provide: ErrorHandler, useClass: ErrorService}
        // {provide: OverlayContainer, useClass: FullscreenOverlayContainer},
      ]
    };
  }
}
