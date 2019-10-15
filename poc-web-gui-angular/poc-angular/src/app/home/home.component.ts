import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AppConfig} from '../app-config.service';
import {Config} from '../../config';



@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  config: AppConfig = Config;
  constructor(private router: Router) {
    console.debug('Constructing the HomeComponent');
  }
}
