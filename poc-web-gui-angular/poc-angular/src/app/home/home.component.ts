import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ConfigService} from '../app-config.service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(
    private router: Router,
    public config: ConfigService) {
    console.debug('Constructing the HomeComponent');
  }
}
