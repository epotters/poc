import {AfterContentInit, Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material";

import {Config} from '../config';
import {AuthService} from "./lib/auth-module/";
import {PocApiService} from "./core/service";
import {PocAnimations} from "./app-animations";
import {HttpErrorInterceptor} from "./core/error/error.interceptor";
import {ErrorHandlerService} from "./core/error/error-handler.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    PocAnimations.fadeInOut
  ]
})
export class AppComponent implements OnInit, AfterContentInit {

  Config: any = Config;
  visible: boolean = false;

  constructor(
    private titleService: Title,
    public authService: AuthService,
    public snackBar: MatSnackBar,
    public apiService: PocApiService,
    public errorInterceptor: HttpErrorInterceptor,
    public errorHandlerService: ErrorHandlerService
  ) {
    console.debug('Constructing the AppComponent "' + Config.applicationDisplayName + '"');
    this.titleService.setTitle(Config.applicationDisplayName);
  }

  ngOnInit() {


    // this.errorInterceptor.awaitErrors().subscribe((error) => {
    //     if (error != null) {
    //       console.log('Received error with code ' + error.code);
    //       this.openSnackBar(error.message, 'Close');
    //     }
    //   }
    // );
    //
    //
    // this.apiService.awaitErrors().subscribe((error) => {
    //     if (error != null) {
    //       console.log('Received error with status ' + error.status);
    //       this.openSnackBar(error, 'Close');
    //     }
    //   }
    // );
  }

  ngAfterContentInit() {
    this.visible = true;

    this.errorHandlerService.awaitErrors().subscribe((error) => {
        if (error != null) {
          console.log('Received error with code ' + error.code);
          this.openSnackBar(error.message, 'Close');
        }
      }
    );
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }


  onAnimationEvent(event: AnimationEvent) {
    console.debug('---> AppComponent - AnimationEvent', event);
  }
}
