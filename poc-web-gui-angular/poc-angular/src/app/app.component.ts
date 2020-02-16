import {AfterContentInit, Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material/snack-bar";

import {AuthService} from "./lib/auth-module/";
import {PocAnimations} from "./app-animations";
import {ErrorService} from "./core/error/error.service";
import {ConfigService} from "./app-config.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    PocAnimations.fadeInOut
  ]
})
export class AppComponent implements OnInit, AfterContentInit {

  visible: boolean = false;

  constructor(
    private titleService: Title,
    public configService: ConfigService,
    public authService: AuthService,
    public errorHandlerService: ErrorService,
    public snackBar: MatSnackBar
  ) {
    console.debug('Constructing the AppComponent "' + configService.applicationDisplayName + '"');
    this.titleService.setTitle(configService.applicationDisplayName);
  }

  ngOnInit() {
    let consoleStyle = ['display: block', 'padding: 2px', 'font-weight: bold', 'font-size: 14px'].join(";");
    console.log('%c☯ ' + this.configService.applicationDisplayName + ' ☯', consoleStyle);

    this.errorHandlerService.awaitErrors().subscribe((error) => {
        console.debug('Inside subscription to awaitErrors');
        if (error != null) {
          console.log('Received error with code ' + error.code);
          this.openSnackBar(error.message, 'Close');
        }
      }
    );
  }

  ngAfterContentInit() {
    this.visible = true;
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  onAnimationEvent(event: AnimationEvent) {
    // console.debug('---> AppComponent - AnimationEvent', event);
  }
}
