import {Component} from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-home-page',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {

  public pageTitle = 'General information';

  constructor(private router: Router,) {
  }
}
