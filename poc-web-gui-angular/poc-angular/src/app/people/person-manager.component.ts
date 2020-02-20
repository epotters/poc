import {Observable, Subject} from "rxjs";

import {Component, ComponentFactoryResolver} from "@angular/core";
import {EntityManagerComponent} from "../lib/entity-module";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";

import {MatDialog} from "@angular/material/dialog";

import {EntityComponentDescriptor} from "../lib/entity-module/dialog/entity-component-dialog.component";
import {FieldFilter} from "../lib/entity-module/domain/filter.model";

import {PocAnimations} from "../app-animations";

import {Person} from "../core/domain/";
import {personMeta} from "./person-meta";
import {PersonService} from "./person.service";
import {PersonListComponent} from "./person-list.component";
import {PersonEditorComponent} from "./person-editor.component";


@Component({
  selector: 'person-manager',
  templateUrl: './person-manager.component.html',
  styleUrls: [],
  animations: [
    PocAnimations.fadeInOut,
    PocAnimations.slideInOut
  ]
})
export class PersonManagerComponent extends EntityManagerComponent<Person> {

  initialFilters: FieldFilter[];
  listOfCardsVisible: boolean = false;

  entityForm: FormGroup;

  // dataSource: EntityDataSource<Person>;
  peopleObservable: Observable<Person[]>;
  personSearch$ = new Subject<string>();

  constructor(
    public service: PersonService,
    public route: ActivatedRoute,
    public componentFactoryResolver: ComponentFactoryResolver,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    super(personMeta, service, route, componentFactoryResolver, dialog);

    this.initialFilters = [
      {name: 'lastName', rawValue: 'po'}
    ];

    this.editorVisible = false;
    this.listVisible = false;

    this.entityForm = this.buildSelectDemoForm(formBuilder);

  }


  ngOnInit() {
    // this.dataSource = new EntityDataSource<Person>(this.meta, this.service);
    // this.peopleObservable = this.dataSource.connect();
    // this.personSearch$.subscribe((term: string) => {
    //   this.dataSource.loadEntities([{name: 'lastName', rawValue: term}],
    //     'lastName', 'asc', 0, 50);
    // });
  }


  buildSelectDemoForm(formBuilder: FormBuilder): FormGroup {
    let group = {};
    group['entitySelector'] = new FormControl('');
    return formBuilder.group(group);
  }


  toggleListOfCards() {
    this.listOfCardsVisible = !this.listOfCardsVisible;
  }


  openDialogWithList() {
    const entityListComponentDescriptor = new EntityComponentDescriptor(PersonListComponent,
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
    const entityEditorComponentDescriptor = new EntityComponentDescriptor(PersonEditorComponent, {
      entityToLoad: entity
    });
    this.openDialogWithEntityComponent(entityEditorComponentDescriptor);
  }

}
