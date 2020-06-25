import {CommonModule} from '@angular/common';
import {ErrorHandler, ModuleWithProviders, NgModule} from '@angular/core';
import {ErrorHandlerComponent} from './error-handler.component';
import {ErrorService} from './error.service';


// Source: https://www.freecodecamp.org/news/global-error-handling-in-angular-with-the-help-of-the-cdk/
@NgModule({
  declarations: [ErrorHandlerComponent],
  imports: [
    CommonModule
    // OverlayModule, A11yModule
  ],
  exports: [
    ErrorHandlerComponent
  ]
})
export class ErrorModule {
  public static forRoot(): ModuleWithProviders<ErrorModule> {
    return {
      ngModule: ErrorModule,
      providers: [
        {provide: ErrorHandler, useClass: ErrorService}
        // {provide: OverlayContainer, useClass: FullscreenOverlayContainer},
      ]
    };
  }
}
