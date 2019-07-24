import {Input, OnInit} from "@angular/core";
import {EntityMeta} from "./domain/entity-meta.model";
import {EntityService} from "./entity.service";
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject} from "rxjs";

export abstract class EntityRelationComponent<T extends Identifiable, S extends Identifiable, R extends Identifiable> implements OnInit {

  @Input() ownerSubject: BehaviorSubject<S>;
  relationsSubject: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  isVisible: boolean = false;

  
  // TODO: Move this to meta config
  ownerFieldName: string;
  relatedFieldName: string;
  relatedDisplayField: string;
  relationDisplayName: string;

  prefillQueryParams: any = {};


  constructor(
    public meta: EntityMeta<T>,
    public ownerMeta: EntityMeta<S>,
    public relatedMeta: EntityMeta<R>,
    public service: EntityService<T>,
    public route: ActivatedRoute
  ) {
    console.debug('Constructing the EntityRelationComponent for relation ' + this.meta.displayName + ' between ' +
      this.ownerMeta.displayName + ' and ' + this.relatedMeta.displayName);

  }

  ngOnInit() {
    console.debug('Initializing the EntityRelationComponent for relation ' + this.meta.displayName + ' between ' +
      this.ownerMeta.displayName + ' and ' + this.relatedMeta.displayName);

    this.prefillQueryParams[this.ownerFieldName + '.id'] = this.getOwnerIdFromPath();

    console.debug(this.prefillQueryParams);

    this.ownerSubject.asObservable().subscribe(owner => {
        console.debug('Inside subscription to the ownerSubject');
        console.debug(owner);

        if (owner) {

          this.prefillQueryParams[this.ownerFieldName + '.id'] = owner.id;
          this.isVisible = true;

          this.service.listRelationsByOwner(this.ownerMeta.namePlural, owner.id)
            .subscribe(relations => {
              console.debug('Inside subscription to the relationService');
              console.debug(relations);
              this.relationsSubject.next(relations);
              console.debug('Just called relationsSubject.next');
            });
        } else {
          console.debug('No entity yet');
        }
      }
    )
  }


  getOwnerIdFromPath(): number | null {
    return parseInt(this.route.snapshot.paramMap.get('id'));
  }
}
