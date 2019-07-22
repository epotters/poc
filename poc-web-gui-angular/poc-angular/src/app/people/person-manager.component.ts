import {Component} from "@angular/core";
import {Person} from "../core/domain/";
import {personMeta} from "./person-meta";
import {PersonService} from "./person.service";
import {EntityManagerComponent} from "../lib/entity-module";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'person-manager',
  templateUrl: './person-manager.component.html',
  styleUrls: []
})
export class PersonManagerComponent extends EntityManagerComponent<Person> {
  
  constructor(
    public service: PersonService,
    public route: ActivatedRoute
  ) {
    super(personMeta, service, route);
  }

}
