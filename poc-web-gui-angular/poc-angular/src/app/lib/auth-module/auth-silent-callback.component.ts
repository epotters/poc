import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-auth-silent-callback',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthSilentCallbackComponent implements OnInit {

  message: string = 'Initializing Silent Authentication Callback Page';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    console.debug(this.message, location.href);

    if (AuthSilentCallbackComponent.iniFrame()) {
      console.debug("The Silent Authentication Callback Page is loaded in an iFrame");
    } else {
      console.debug("The Silent Authentication Callback Page is NOT loaded in an iFrame");
    }

    // TODO: Handle error in the callback url
    let error: string | null = this.route.snapshot.queryParamMap.get('error');
    if (!!error && error === 'login_required') {
      console.debug('Error reported in silent auth callback url: ' + error);
    }

    this.authService.completeSilentAuthentication()
      .then(() => console.info('Silent refresh completed'))
      .catch((errorMessage: string) => console.error('Error while completing silent authentication: ' + errorMessage));
  }


  private static iniFrame(): boolean {
    // return (window.self !== window.top);
    return (window.location !== window.parent.location);
  }

}
