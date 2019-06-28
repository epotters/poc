import {Component} from '@angular/core';

import {AuthService, User} from './core/service/auth.service';
import {Constants} from '../constants';
import {ApiService} from "./core/service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  currentUser: User;
  Constants: any = Constants;
  messages: string[] = [];

  // From oidc-client sample
  constructor(public authService: AuthService, public apiService: ApiService) {

    console.debug('Constructing the AppComponent');
  }

  get currentUserJson(): string {
    return JSON.stringify(this.currentUser, null, 2);
  }


  ngOnInit(): void {
    console.debug("Initializing application...");
    // this.loadUser();
  }


  // public loadUser() {
  //   this.authService.getUser().then(user => {
  //     this.currentUser = user;
  //
  //     if (user) {
  //       this.addMessage('User Logged In');
  //     } else {
  //       this.addMessage('User Not Logged In');
  //     }
  //   }).catch(err => this.addError(err));
  // }

  // public onLogin() {
  //   this.clearMessages();
  //   this.authService.login().catch(err => {
  //     this.addError(err);
  //   });
  // }
  //
  // public onRenewToken() {
  //   this.clearMessages();
  //   this.authService.renewToken()
  //     .then(user => {
  //       this.currentUser = user;
  //       this.addMessage('Silent Renew Success');
  //     })
  //     .catch(err => this.addError(err));
  // }
  //
  // public onLogout() {
  //   this.clearMessages();
  //   this.authService.logout().catch(err => this.addError(err));
  // }

  private clearMessages() {
    while (this.messages.length) {
      this.messages.pop();
    }
  }

  private addMessage(msg: string) {
    this.messages.push(msg);
  }

  private addError(msg: string | any) {
    this.messages.push('Error: ' + msg && msg.message);
  }
}
