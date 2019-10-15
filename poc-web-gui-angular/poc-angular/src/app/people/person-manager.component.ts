import {Component, ComponentFactoryResolver} from "@angular/core";
import {Person} from "../core/domain/";
import {personMeta} from "./person-meta";
import {PersonService} from "./person.service";
import {EntityManagerComponent} from "../lib/entity-module";
import {ActivatedRoute} from "@angular/router";
import {EntityComponentDescriptor} from "../lib/entity-module/dialog/entity-component-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {PersonListComponent} from "./person-list.component";
import {PersonEditorComponent} from "./person-editor.component";
import {FieldFilter} from "../lib/entity-module/domain/filter.model";
import {PocAnimations} from "../app-animations";


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

  constructor(
    public service: PersonService,
    public route: ActivatedRoute,
    public componentFactoryResolver: ComponentFactoryResolver,
    public dialog: MatDialog
  ) {
    super(personMeta, service, route, componentFactoryResolver, dialog);

    this.initialFilters = [
      {name: 'lastName', rawValue: 'po'}
    ];

    this.editorVisible = false;
    this.listVisible = false;
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
