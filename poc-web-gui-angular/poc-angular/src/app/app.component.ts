import {AfterContentInit, Component} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material";

import {Constants} from '../constants';
import {AuthService} from "./lib/auth-module/";
import {PocApiService} from "./core/service";
import {Animations} from "./app-animations";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    Animations.fadeIn,
    Animations.fadeOut
  ]
})
export class AppComponent implements AfterContentInit {

  Constants: any = Constants;
  visible: boolean = false;

  constructor(
    private titleService: Title,
    public authService: AuthService,
    public snackBar: MatSnackBar,
    public apiService: PocApiService
  ) {
    console.debug('Constructing the AppComponent "' + Constants.applicationDisplayName + '"');
    this.titleService.setTitle(Constants.applicationDisplayName);
  }

  ngAfterContentInit() {

    this.apiService.awaitErrors().subscribe((error) => {
        console.log('Received error with status ' + error.status);
        this.openSnackBar(error, 'Close');
      }
    );

    this.visible = true;
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
