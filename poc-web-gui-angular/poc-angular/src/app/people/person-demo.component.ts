import {Component, ComponentFactoryResolver, OnInit, Type} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {EntityComponentDescriptor, EntityManagerComponent, FieldFilter} from 'entity-lib';
import {NGXLogger} from 'ngx-logger';
import {BehaviorSubject} from 'rxjs';

import {PocAnimations} from '../app-animations';

import {Person} from '../core/domain/';
import {PersonEditorComponent} from './person-editor.component';
import {PersonListComponent} from './person-list.component';
import {personMeta} from './person-meta';
import {PersonService} from './person.service';


@Component({
  selector: 'person-demo',
  templateUrl: './person-demo.component.html',
  styleUrls: [],
  animations: [
    PocAnimations.fadeInOut,
    PocAnimations.slideInOut
  ]
})
export class PersonDemoComponent extends EntityManagerComponent<Person> implements OnInit {

  demoFormVisible: boolean = true;

  entityForm: FormGroup;
  listComponent: Type<any> = PersonListComponent;
  editorComponent: Type<any> = PersonEditorComponent;

  entitySubject: BehaviorSubject<Person> = new BehaviorSubject<Person>({} as Person);

  initialFilters: FieldFilter[];

  constructor(
    public service: PersonService,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public componentFactoryResolver: ComponentFactoryResolver,
    private formBuilder: FormBuilder,
    public logger: NGXLogger
  ) {
    super(personMeta, service, route, dialog, componentFactoryResolver, logger);

    this.title = `Demo componenten ${this.meta.displayNamePlural.toLowerCase()}`;
    this.initialFilters = [
      {name: 'lastName', rawValue: 'po'}
    ];

    this.entityForm = this.buildSelectDemoForm(this.formBuilder);
  }

  ngOnInit() {

    const person: Person = JSON.parse('{ "id": 350, "firstName": "Berriona", "prefix": null, "lastName": "Abbotts", "gender": "FEMALE", "birthDate": "2019-01-14", "birthPlace": "Thabazimbi", "birthCountry": null, "household": null }');
    this.entitySubject.next(person);
  }

  buildSelectDemoForm(formBuilder: FormBuilder): FormGroup {
    const group = {};
    group['entitySelector'] = new FormControl('');
    group['entitySelectorList'] = new FormControl('');

    group['lastName'] = new FormControl('');
    group['gender'] = new FormControl('');

    return formBuilder.group(group);
  }


  toggleDemoForm() {
    this.demoFormVisible = !this.demoFormVisible;
  }


  openDialogWithList() {
    const entityListComponentDescriptor = new EntityComponentDescriptor(this.listComponent,
      {
        columns: this.meta.displayedColumnsDialog,
        title: 'Minimal list with all features hidden',
        headerVisible: false,
        paginatorVisible: false,
        filterVisible: false,
        editorVisible: false,
        initialFilters: this.initialFilters
      });
    this.openDialogWithEntityComponent(entityListComponentDescriptor);
  }


  openDialogWithEditor(entity?: Person) {
    const entityEditorComponentDescriptor = new EntityComponentDescriptor(this.editorComponent, {
      entityToLoad: entity,
      isManaged: true
    });
    this.openDialogWithEntityComponent(entityEditorComponentDescriptor);
  }

}
