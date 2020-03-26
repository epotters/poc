import {AfterContentInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material/snack-bar';

import {AuthService} from './lib/auth-module/';
import {PocAnimations} from './app-animations';
import {ErrorService} from './core/error/error.service';
import {ConfigService} from './app-config.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    PocAnimations.fadeInOut
  ]
})
export class AppComponent implements OnInit, AfterContentInit, OnDestroy {

  visible: boolean = false;
  private terminator: Subject<any> = new Subject();

  constructor(
    private titleService: Title,
    public configService: ConfigService,
    public authService: AuthService,
    public errorHandlerService: ErrorService,
    public snackBar: MatSnackBar
  ) {
    console.debug(`Constructing the AppComponent "${configService.applicationDisplayName}"`);
    this.titleService.setTitle(configService.applicationDisplayName);
  }

  ngOnInit() {
    const consoleStyle = ['display: block', 'padding: 2px', 'font-weight: bold', 'font-size: 14px'].join(';');
    console.info('%c☯ ' + this.configService.applicationDisplayName + ' ☯', consoleStyle);

    this.errorHandlerService.awaitErrors().pipe(takeUntil(this.terminator)).subscribe((error) => {
        console.debug('Inside subscription to awaitErrors');
        if (error != null) {
          console.info('Received error with code ' + error.code);
          this.openSnackBar(error.message, 'Close');
        }
      }
    );
  }

  ngAfterContentInit() {
    this.visible = true;
  }

  ngOnDestroy() {
    this.terminator.next();
    this.terminator.complete();
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
