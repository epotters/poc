import {AfterContentInit, Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Title} from '@angular/platform-browser';

import {AuthService} from 'auth-lib';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {PocAnimations} from './app-animations';
import {ConfigService} from './app-config.service';
import {ErrorService} from './core/error/error.service';


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

    this.errorHandlerService.errorSubject.pipe(takeUntil(this.terminator)).subscribe((error) => {
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
}
