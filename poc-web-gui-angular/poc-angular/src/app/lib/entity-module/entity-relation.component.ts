import {Input, OnInit} from "@angular/core";
import {EntityMeta} from "./domain/entity-meta.model";
import {EntityService} from "./entity.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {EntityDataSource} from "./entity-data-source";

export abstract class EntityRelationComponent<T extends Identifiable, S extends Identifiable, R extends Identifiable> implements OnInit {

  @Input() ownerSubject: BehaviorSubject<S>;

  relationsSubject: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  relatedDataSource: EntityDataSource<R>;

  relatedEntityForm: FormGroup;
  isVisible: boolean = false;

  formVisible: boolean = false;
  showAddButton: boolean = true;

  prefillQueryParams: any = {};


  // TODO: Move this to meta config
  relationDisplayName: string;
  ownerFieldName: string;
  relatedFieldName: string;
  relatedDisplayField: string;
  relatedNamePlural: string;

  filterFieldName: string;
  sortFieldName: string;
  sortDirection: ('asc' | 'desc') = 'asc';

  autoCompletePageSize: number = 25;


  constructor(
    public meta: EntityMeta<T>,
    public ownerMeta: EntityMeta<S>,
    public relatedMeta: EntityMeta<R>,
    public service: EntityService<T>,
    public relatedService: EntityService<R>,
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute
  ) {
    console.debug('Constructing the EntityRelationComponent for relation ' + this.meta.displayName + ' between ' +
      this.ownerMeta.displayName + ' and ' + this.relatedMeta.displayName);
  }


  ngOnInit() {
    console.debug('Initializing the EntityRelationComponent for relation ' + this.meta.displayName + ' between ' +
      this.ownerMeta.displayName + ' and ' + this.relatedMeta.displayName);

    this.relatedDataSource = new EntityDataSource<R>(this.relatedMeta, this.relatedService);
    this.relatedEntityForm = this.buildForm(this.formBuilder);

    this.prefillQueryParams[this.ownerFieldName + '.id'] = this.getOwnerIdFromPath();
    console.debug(this.prefillQueryParams);

    this.activateRelatedEntityList();
    this.activateRelatedEntityControl();
  }


  private activateRelatedEntityList(): void {
    this.ownerSubject.asObservable().subscribe(owner => {
        console.debug('Inside subscription to the ownerSubject');
        console.debug(owner);

        if (owner) {

          this.prefillQueryParams[this.ownerFieldName + '.id'] = owner.id;
          this.isVisible = true;

          this.loadRelatedEntities(owner);
        } else {
          console.debug('No entity yet');
        }
      }
    );
  }

  private loadRelatedEntities(owner: S): void {
    this.service.listRelationsByOwner(this.ownerMeta.namePlural, owner.id, this.relatedNamePlural, this.relatedFieldName + '.' + this.sortFieldName)
      .subscribe(relations => {
        console.debug('Inside subscription to the relationService');
        console.debug(relations);
        this.relationsSubject.next(relations);
        console.debug('Just called relationsSubject.next');
      });
  }


  private activateRelatedEntityControl(): void {

    console.debug('About to activateRelatedEntityControl');
    console.debug('  this.filterFieldName: ' + this.filterFieldName);

    this.relatedEntityForm
      .get(this.relatedFieldName)
      .valueChanges
      .subscribe((value) => {
        console.debug('About to load new ' + this.relatedMeta.displayNamePlural + ' for autocomplete. Filter ' + value);
        if (this.formVisible) {
          this.relatedDataSource.loadEntities(
            [{name: this.filterFieldName, rawValue: value}],
            this.sortFieldName,
            this.sortDirection,
            0,
            this.autoCompletePageSize
          );
        }
      });

  }

  buildForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      [this.relatedFieldName]: new FormControl()
    });
  }

  showForm(): void {
    this.formVisible = true;

    // Focus o the form field
    // this.relatedEntityForm.get(this.relatedFieldName).
  }


  hideForm(): void {
    this.formVisible = false;
  }


  addOption() {
    console.debug('Add a new ' + this.relatedMeta.displayName);
    this.router.navigate([this.relatedMeta.apiBase + '/new'], {queryParams: {[this.filterFieldName]: this.relatedEntityForm.get(this.relatedFieldName).value}});
  }


  getOwnerIdFromPath(): number | null {
    return parseInt(this.route.snapshot.paramMap.get('id'));
  }


  displayOptionRelatedEntity(entity?: R): string | undefined {
    console.debug('Inside displayOptionRelatedEntity');

    if (entity) {
      return (entity[this.relatedDisplayField]);
    } else {
      console.debug('No entity to display in autocomplete');
      return undefined;
    }
  }

  relatedEntitySelected(entity: R) {
    console.log('Related entity selected', entity);
    this.saveRelation();
  }

  onClick(event: MouseEvent, entity: T) {
    event.preventDefault();
    if (event.ctrlKey) {
      this.deleteRelation(entity);
    }
  }

  deleteRelation(relation) {
    console.log('Delete this relation');
  }

  saveRelation() {
    if (this.relatedEntityForm.valid) {

      let relationEntity: T = this.relatedEntityForm.getRawValue();
      relationEntity[this.ownerFieldName] = this.ownerSubject.getValue();

      console.log('Ready to save', relationEntity);

      this.service.save(relationEntity).subscribe((savedEntity) => {
        let msg: string;
        if (relationEntity.id) {
          msg = this.meta.displayName + ' with id ' + relationEntity.id + ' is updated successfully';
        } else {
          msg = this.meta.displayName + ' is created successfully with id ' + savedEntity.id;
        }
        console.info(msg);
        console.log('savedEntity: ', savedEntity);

        this.relatedEntityForm.reset();
        this.relatedEntityForm.markAsPristine();
        this.relatedEntityForm.markAsUntouched();

        this.hideForm();

        this.loadRelatedEntities(this.ownerSubject.getValue());

      });
    } else {
      console.info('No valid related entity chosen');
    }
  }
}
