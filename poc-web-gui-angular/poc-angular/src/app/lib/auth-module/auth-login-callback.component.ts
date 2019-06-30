import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthLoginCallbackComponent implements OnInit {

  private message: string = 'Auth Login Callback Page';

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    console.debug(this.message);
    this.authService.completeAuthentication();
  }

}
