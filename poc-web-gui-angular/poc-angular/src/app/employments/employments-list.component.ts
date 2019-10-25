import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material";

import {EntityListComponent} from "../lib/entity-module";
import {employmentMeta as meta} from "./employment-meta";
import {Employment} from "../core/domain/"
import {EmploymentService} from "./employment.service";
import {EntityAnimations} from "../lib/entity-module/common/animations.animation";


@Component({
  selector: 'employment-list-card',
  templateUrl: '../lib/entity-module/entity-list.component.html',
  styleUrls: ['../lib/entity-module/entity-list.component.css'],
  animations: [
    EntityAnimations.slideTo
  ]
})
export class EmploymentListComponent extends EntityListComponent<Employment> {

  constructor(
    public service: EmploymentService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    super(meta, service, router, route, dialog);
  }
}
