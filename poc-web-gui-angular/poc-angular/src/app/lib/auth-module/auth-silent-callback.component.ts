import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-auth-silent-callback',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthSilentCallbackComponent implements OnInit {

  private message: string = 'Auth Silent Refresh Page';

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    console.debug(this.message);
    this.authService.completeSilentAuthentication();
  }

}
