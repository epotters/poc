import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {Constants} from '../../constants';


@Component({
  selector: 'app-home-page',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {
  Constants: any = Constants;
  
  public pageTitle = 'General information';

  constructor(private router: Router, ) {
    console.debug('Constructing the InfoComponent');
  }

}
