import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-auth-silent-callback',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthSilentCallbackComponent implements OnInit {

  message: string = 'Initializing Authentication Silent Callback Page';

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    console.debug(this.message);
    this.authService.completeSilentAuthentication()
      .then(() => console.info('Silent refresh completed successfully. Is user logged in? ' + this.authService.isLoggedIn()))
      .catch((errorMessage: string) => console.error('Error while completing silent authentication: ' + errorMessage));
  }

}
