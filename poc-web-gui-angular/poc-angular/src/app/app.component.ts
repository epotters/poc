import {Component, enableProdMode} from '@angular/core';
import {Constants} from '../constants';
import {ActivatedRoute} from "@angular/router";
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
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    console.debug('Constructing the AppComponent "' + Constants.applicationDisplayName + '"');


    if (Constants.environment != 'dev') {
      enableProdMode();
    }
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
