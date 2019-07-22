import {OnInit} from '@angular/core';

import {EntityService} from "./entity.service";
import {EntityMeta} from "./domain/entity-meta.model";
import {ActivatedRoute} from "@angular/router";


export abstract class EntityManagerComponent<T extends Identifiable> implements OnInit {

  selectedEntity?: T;
  view: string = 'list';  // 'list' | 'editor'

  constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>,
    public route: ActivatedRoute
  ) {
    console.debug('Constructing the EntityManagerComponent for type ' + this.meta.displayName);
  }

  ngOnInit() {
    console.debug('Initializing the EntityManagerComponent for type ' + this.meta.displayName);
  }

  entityFromRoute() {

    let entityId = this.route.snapshot.paramMap.get('id');

    if (entityId) {
      // this.loadEntity(entityId);
    } else {
      console.info('Editor for a new entity');
    }
  }


  onEntitySelected($event) {
    console.debug('EntitySelected event received');
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
