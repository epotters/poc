import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Constants} from '../../constants';


@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  Constants: any = Constants;

  constructor(private router: Router) {
    console.debug('Constructing the HomeComponent');
  }
}
