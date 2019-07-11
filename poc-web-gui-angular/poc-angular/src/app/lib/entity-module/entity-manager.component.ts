import {OnInit} from '@angular/core';

import {EntityService} from "./entity.service";
import {EntityMeta} from "./domain/entity-meta.model";


export abstract class EntityManagerComponent<T extends Identifiable> implements OnInit {

  selectedEntity?: T;
  view: string = 'list';  // 'list' | 'editor'

  constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>
  ) {
    console.debug('Constructing the EntityManagerComponent for type ' + this.meta.displayName);
  }

  ngOnInit() {
    console.debug('Initializing the EntityManagerComponent for type ' + this.meta.displayName);
  }


  onEntitySelected($event) {
    console.debug('Event received');
    console.debug($event);
    this.selectedEntity = $event;
  }

  showList() {
    this.view = 'list';
    console.debug('Show list only');

    // this.editor.hide();
    // this.list.show();
  }

  showEditor() {
    this.view = 'editor';
    console.debug('Show editor only');

    // this.list.hide();
    // this.editor.show();
  }

  toggleView(): void {
    if (this.view === 'list') {
      this.showEditor();
    } else {
      this.showList();
    }
  }


}
