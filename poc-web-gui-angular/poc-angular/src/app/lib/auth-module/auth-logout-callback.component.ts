import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-auth-logout-callback',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthLogoutCallbackComponent implements OnInit {

  private message: string = 'Auth Logout Callback Page';

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    console.debug(this.message);
    this.authService.completeLogout();
  }

}
