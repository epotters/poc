import {Component} from '@angular/core';
import {Title} from "@angular/platform-browser";
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
    private titleService: Title,
    public authService: AuthService
  ) {
    console.debug('Constructing the AppComponent "' + Constants.applicationDisplayName + '"');
    this.titleService.setTitle(Constants.applicationDisplayName);
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
