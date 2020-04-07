import {Component, ComponentFactoryResolver, Type, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {ActivatedRoute} from '@angular/router';

import {EntityComponentDescriptor, EntityManagerComponent, EntityRelativeNavigationComponent} from 'entity-lib';
import {NGXLogger} from 'ngx-logger';

import {PocAnimations} from '../app-animations';
import {Person} from '../core/domain/';
import {PersonDetailComponent} from './person-detail.component';
import {PersonEditorComponent} from './person-editor.component';
import {PersonListOfCardsComponent} from './person-list-of-cards.component';
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


  listComponent: Type<any> = PersonListComponent;
  cardsComponent: Type<any> = PersonListOfCardsComponent;
  detailComponent: Type<any> = PersonDetailComponent;
  editorComponent: Type<any> = PersonEditorComponent;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(EntityRelativeNavigationComponent, {static: true}) relNav: EntityRelativeNavigationComponent<Person>;

  constructor(
    public service: PersonService,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public componentFactoryResolver: ComponentFactoryResolver,
    public logger: NGXLogger
  ) {
    super(personMeta, service, route, dialog, componentFactoryResolver, logger);

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
        initialFilters: []
      });
    this.openDialogWithEntityComponent(entityListComponentDescriptor);
  }

  openDialogWithEditor() {
    const entityEditorComponentDescriptor = new EntityComponentDescriptor(this.editorComponent, {
      entityToLoad: this.selectedEntity,
      isManaged: true
    });
    this.openDialogWithEntityComponent(entityEditorComponentDescriptor);
  }

}
