import {Component, ViewChild} from "@angular/core";
import {Person} from "../core/domain/";
import {personMeta} from "./person-meta";
import {PersonService} from "./person.service";
import {EntityManagerComponent} from "../lib/entity-module";
import {PersonListComponent} from "./person-list.component";
import {PersonComponent} from "./person.component";

@Component({
  selector: 'person-manager',
  templateUrl: './person-manager.component.html',
  styleUrls: []
})
export class PersonManagerComponent extends EntityManagerComponent<Person> {

  // @ViewChild(OrganizationListComponent, {static: true}) list: OrganizationListComponent;
  // @ViewChild(OrganizationComponent, {static: true}) editor: OrganizationComponent;

  constructor(
    public service: PersonService,
  ) {
    super(personMeta, service);
  }

}
