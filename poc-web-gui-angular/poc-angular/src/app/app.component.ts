import {Component} from '@angular/core';
import {Constants} from '../constants';
import {AuthService} from "./lib/auth-module/";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  Constants: any = Constants;
  messages: string[] = [];

  constructor(
    public authService: AuthService
  ) {
    console.debug('Constructing the AppComponent "' + Constants.applicationDisplayName + '"');
  }


  // Message service
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
