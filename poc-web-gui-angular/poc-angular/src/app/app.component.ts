import {AfterContentInit, Component} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material";
import {animate, AnimationTransitionMetadata, style, transition, trigger} from "@angular/animations";

import {AuthService} from "./lib/auth-module/";
import {Constants} from '../constants';

let enterTransition: AnimationTransitionMetadata;
enterTransition = transition(':enter', [
  style({
    opacity: 0
  }),
  animate('1s ease-in', style({
    opacity: 1
  }))
]);

const leaveTransition = transition(':leave', [
  style({
    opacity: 1
  }),
  animate('1s ease-out', style({
    opacity: 0
  }))
]);

const fadeIn = trigger('fadeIn', [
  enterTransition
]);

const fadeOut = trigger('fadeOut', [
  leaveTransition
]);



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    fadeIn,
    fadeOut
  ]
})
export class AppComponent implements AfterContentInit {

  Constants: any = Constants;
  visible: boolean = false;

  constructor(
    private titleService: Title,
    public authService: AuthService,
    public snackBar: MatSnackBar
  ) {
    console.debug('Constructing the AppComponent "' + Constants.applicationDisplayName + '"');
    this.titleService.setTitle(Constants.applicationDisplayName);
  }

  ngAfterContentInit() {
    this.visible = true;
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
