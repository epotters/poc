import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-auth-silent-callback',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthSilentCallbackComponent implements OnInit {

  message: string = 'Initializing Authentication Silent Callback Page';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    console.debug(this.message, location.href);

    // TODO: Handle error in the callback url
    let error: string | null = this.route.snapshot.queryParamMap.get('error');
    if (!!error && error === 'login_required') {
      console.debug('Error reported in silent auth callback url: ' + error);
    }


    this.authService.completeSilentAuthentication()
      .then(() => console.info('Silent refresh completed'))
      .catch((errorMessage: string) => console.error('Error while completing silent authentication: ' + errorMessage));
  }

}
