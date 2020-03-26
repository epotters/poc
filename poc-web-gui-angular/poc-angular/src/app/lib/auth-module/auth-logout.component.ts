import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-auth-logout',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthLogoutComponent implements OnInit {

  message: string = 'Auth Logout Page';

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    console.debug(this.message);
    this.authService.startLogout();
  }

}
