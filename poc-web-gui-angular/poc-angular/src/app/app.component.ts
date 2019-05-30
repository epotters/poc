import {Component} from '@angular/core';

import {AppAuthNService, User} from './core/service/app-auth-n.service';
import {Constants} from '../constants';
import {ApiService} from "./core/service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  // From oidc-client sample
  constructor(public authn: AppAuthNService, public apiService: ApiService) {

    console.debug('Constructing the AppComponent');
  }

  messages: string[] = [];

  get currentUserJson(): string {
    return JSON.stringify(this.currentUser, null, 2);
  }

  currentUser: User;
  Constants: any = Constants;

  ngOnInit(): void {
    this.authn.getUser().then(user => {
      this.currentUser = user;

      if (user) {
        this.addMessage('User Logged In');
      } else {
        this.addMessage('User Not Logged In');
      }
    }).catch(err => this.addError(err));
  }

  public onLogin() {
    this.clearMessages();
    this.authn.login().catch(err => {
      this.addError(err);
    });
  }

  public onRenewToken() {
    this.clearMessages();
    this.authn.renewToken()
      .then(user => {
        this.currentUser = user;
        this.addMessage('Silent Renew Success');
      })
      .catch(err => this.addError(err));
  }

  public onLogout() {
    this.clearMessages();
    this.authn.logout().catch(err => this.addError(err));
  }

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
