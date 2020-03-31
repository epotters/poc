import {Component, ComponentFactoryResolver, Type} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';

import {PocAnimations} from '../app-animations';

import {Person} from '../core/domain/';
import {EntityManagerComponent} from '../lib/entity-module';
import {EntityComponentDescriptor} from '../lib/entity-module/common/component-loader/entity-component-entrypoint.directive';
import {FieldFilter} from '../lib/entity-module/domain/filter.model';
import {PersonEditorComponent} from './person-editor.component';
import {PersonListComponent} from './person-list.component';
import {personMeta} from './person-meta';
import {PersonService} from './person.service';


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
  demoFormVisible: boolean = false;

  entityForm: FormGroup;
  listComponent: Type<any> = PersonListComponent;
  editorComponent: Type<any> = PersonEditorComponent;

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


  buildSelectDemoForm(formBuilder: FormBuilder): FormGroup {
    const group = {};
    group['entitySelector'] = new FormControl('');
    group['entitySelectorList'] = new FormControl('');
    return formBuilder.group(group);
  }


  toggleListOfCards() {
    this.listOfCardsVisible = !this.listOfCardsVisible;
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
