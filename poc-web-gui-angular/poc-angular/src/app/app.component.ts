import {Component} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material";
import {AuthService} from "./lib/auth-module/";
import {Constants} from '../constants';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  Constants: any = Constants;

  constructor(
    private titleService: Title,
    public authService: AuthService,
    public snackBar: MatSnackBar
  ) {
    console.debug('Constructing the AppComponent "' + Constants.applicationDisplayName + '"');
    this.titleService.setTitle(Constants.applicationDisplayName);
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
